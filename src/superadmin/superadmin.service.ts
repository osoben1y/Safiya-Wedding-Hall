import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterSuperadminDto } from './dto/register-superadmin.dto';
import { LoginSuperadminDto } from './dto/login-superadmin.dto';
import { ErrorHender } from 'src/common/utils/error-handle';
import { InjectRepository } from '@nestjs/typeorm';
import { SuperadminEntity } from './entities/superadmin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enum/user-enum';
import { successRes } from 'src/common/utils/success-response';

@Injectable()
export class SuperadminService {
  constructor(@InjectRepository(SuperadminEntity) private readonly repo: Repository<SuperadminEntity>) { }

  async onModuleInit() {
    const name = process.env.SUPERADMIN_NAME
    const email = String(process.env.SUPERADMIN_EMAIL)
    const password = String(process.env.SUPERADMIN_PASSWORD)

    try {
      let user = await this.repo.findOne({ where: { email: email } })
      if (!user) {
        let hashpass = bcrypt.hashSync(password, 10)
        const super_admin = this.repo.create({
          name,
          email,
          password: hashpass,
          role: Role.SUPERADMIN
        })
        await this.repo.save(super_admin)
        console.log("Supper_admin creted");

      }
    } catch (error) {
      console.log(error.message);

    }
  }

  async register(createSuperadminDto: RegisterSuperadminDto) {
    try {
      // Allow only a single superadmin in the system
      const total = await this.repo.count();
      if (total > 0) {
        throw new BadRequestException('Superadmin already exists');
      }
      const { name, email, password } = createSuperadminDto
      let user = await this.repo.findOne({ where: { email: email } })
      if (user) {
        throw new BadRequestException(`This email: ${email} already in use`)
      }
      let hashpass = bcrypt.hashSync(password, 10)
      const super_admin = this.repo.create({
        name,
        email,
        password: hashpass,
        role: Role.SUPERADMIN
      })
      await this.repo.save(super_admin)
      console.log("Supper_admin creted");
      return successRes(super_admin)
    } catch (error) {
      ErrorHender(error)
    }
  }

  // Controller compatibility methods
  async create(createSuperadminDto: RegisterSuperadminDto) {
    return this.register(createSuperadminDto);
  }

  async findAll() {
    try {
      const superadmins = await this.repo.find()
      if (!superadmins.length) {
        throw new NotFoundException('Superadmins not found')
      }
      return successRes(superadmins)
    } catch (error) {
      ErrorHender(error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} superadmin`;
  }

  login(updateSuperadminDto: LoginSuperadminDto) {
    return `This action updates a #${updateSuperadminDto.email} superadmin`;
  }

  async update(id: number, updateSuperadminDto: LoginSuperadminDto) {
    // For now, we reuse login logic as the controller expects an update; adjust as needed.
    return this.login(updateSuperadminDto);
  }

  logout() {

  }

  async remove(id: number) {
    try {
      const exist = await this.repo.findOne({ where: { id } });
      if (!exist) throw new NotFoundException(`Superadmin with id: ${id} not found`);
      // Prevent deleting the only superadmin
      const total = await this.repo.count();
      if (total <= 1) {
        throw new BadRequestException('Cannot delete the only superadmin');
      }
      await this.repo.delete(id);
      return successRes({}, 200);
    } catch (error) {
      ErrorHender(error)
    }
  }
}
