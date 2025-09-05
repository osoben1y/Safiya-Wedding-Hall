import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminEntity } from './entities/admin.entity';
import { ErrorHender } from 'src/common/utils/error-handle';
import { successRes } from 'src/common/utils/success-response';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly repo: Repository<AdminEntity>,
  ) { }

  async create(createAdminDto: CreateAdminDto) {
    try {
      const existAdmin = await this.repo.findOne({
        where: { email: createAdminDto.email },
      });

      if (existAdmin) {
        throw new BadRequestException(
          `Admin with email: ${createAdminDto.email} already exists`,
        );
      }

      const admin = this.repo.create(createAdminDto);
      await this.repo.save(admin);

      return successRes(admin, 201);
    } catch (error) {
      ErrorHender(error);
    }
  }

  async findAll() {
    try {
      const admins = await this.repo.find();
  
      if (!admins.length) {
        throw new NotFoundException('Admins not found');
      }
  
      return successRes(admins);
    } catch (error) {
      ErrorHender(error);
    }
  }

  async findOne(id: number) {
    try {
      const admin = await this.repo.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException(`Admin with id: ${id} not found`);
    }

    return successRes(admin);
    } catch (error) {
      ErrorHender(error);
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    try {
    const admin = await this.repo.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException(`Admin with id: ${id} not found`);
    }

    this.repo.merge(admin, updateAdminDto);
    await this.repo.save(admin);

    return successRes(admin);
    } catch (error) {
      ErrorHender(error);
    }
  }

  async remove(id: number) {
    try {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Admin with id: ${id} not found`);
    }

    return successRes({}, 200);
    } catch (error) {
      ErrorHender(error);
    }
  }
}
