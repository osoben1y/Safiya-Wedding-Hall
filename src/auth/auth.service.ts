import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from './entities/otp.entity';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../common/mail/mail.service';
import { Role } from '../common/enum/user-enum';
import { successRes } from '../common/utils/success-response';
import { ErrorHender } from '../common/utils/error-handle';
import { SuperadminEntity } from '../superadmin/entities/superadmin.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(OtpEntity) private readonly otpRepo: Repository<OtpEntity>,
    @InjectRepository(SuperadminEntity) private readonly superRepo: Repository<SuperadminEntity>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private signToken(principal: { id: number; email: string; role: Role | string }) {
    const payload = { sub: principal.id, email: principal.email, role: principal.role };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  async register(dto: RegisterDto) {
    try {
      const exist = await this.userRepo.findOne({ where: { email: dto.email } });
      if (exist) throw new BadRequestException('Email already registered');

      const code = this.generateOtp();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      const passwordHash = bcrypt.hashSync(dto.password, 10);

      const otp = this.otpRepo.create({
        email: dto.email,
        code,
        expiresAt,
        payload: { name: dto.name, email: dto.email, password: passwordHash, role: Role.USER },
      });
      await this.otpRepo.save(otp);

      await this.mailService.sendMail(
        dto.email,
        'Your verification code',
        `<p>Your verification code is <b>${code}</b>. It will expire in 5 minutes.</p>`,
      );

      return successRes({ message: 'OTP sent to email' }, 201);
    } catch (error) {
      throw ErrorHender(error);
    }
  }

  async verifyOtp(dto: VerifyOtpDto) {
    try {
      const record = await this.otpRepo.findOne({ where: { email: dto.email }, order: { created_at: 'DESC' as any } });
      if (!record) throw new NotFoundException('OTP not found');
      if (record.verified) throw new BadRequestException('OTP already used');
      if (record.code !== dto.code) throw new BadRequestException('Invalid OTP code');
      if (record.expiresAt < new Date()) throw new BadRequestException('OTP expired');

      const payload = record.payload || {} as any;
      const existUser = await this.userRepo.findOne({ where: { email: dto.email } });
      if (existUser) throw new BadRequestException('Email already registered');

      const user = this.userRepo.create({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role || Role.USER,
        isVerified: true,
      });
      await this.userRepo.save(user);

      record.verified = true;
      await this.otpRepo.save(record);

      const accessToken = this.signToken({ id: user.id, email: user.email, role: user.role });
      return successRes({ accessToken, user });
    } catch (error) {
      throw ErrorHender(error);
    }
  }

  async login(dto: LoginDto) {
    try {
      let user = await this.userRepo.findOne({ where: { email: dto.email } });
      if (user) {
        if (!user.isVerified) throw new BadRequestException('Please verify your email');
        const match = await bcrypt.compare(dto.password, user.password);
        if (!match) throw new BadRequestException('Invalid email or password');
        const accessToken = this.signToken({ id: user.id, email: user.email, role: user.role });
        return successRes({ accessToken, user });
      }

      const superadmin = await this.superRepo.findOne({ where: { email: dto.email } });
      if (!superadmin) throw new NotFoundException('User not found');
      const ok = await bcrypt.compare(dto.password, superadmin.password);
      if (!ok) throw new BadRequestException('Invalid email or password');

      const accessToken = this.signToken({ id: superadmin.id, email: superadmin.email, role: Role.SUPERADMIN });
      const san = { id: superadmin.id, name: superadmin.name, email: superadmin.email, role: Role.SUPERADMIN };
      return successRes({ accessToken, user: san });
    } catch (error) {
      throw ErrorHender(error);
    }
  }

  async logout() {
    return successRes({ message: 'Logged out' });
  }
}
