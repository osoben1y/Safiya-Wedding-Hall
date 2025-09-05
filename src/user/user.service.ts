import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorHender } from 'src/common/utils/error-handle';
import { successRes } from 'src/common/utils/success-response';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const existUser = await this.repo.findOne({ where: { email: createUserDto.email } });

      if (existUser) {
        throw new BadRequestException(`User with email: ${createUserDto.email} already exists`);
      }

      const user = this.repo.create(createUserDto);
      await this.repo.save(user);

      return successRes(user, 201);
    } catch (error) {
      throw ErrorHender(error);
    }
  }

  async findAll() {
    try {
      const users = await this.repo.find();

      if (!users.length) {
        throw new NotFoundException('Users not found');
      }

      return successRes(users);
    } catch (error) {
      throw ErrorHender(error);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.repo.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`User with id: ${id} not found`);
      }

      return successRes(user);
    } catch (error) {
      throw ErrorHender(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.repo.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`User with id: ${id} not found`);
      }

      this.repo.merge(user, updateUserDto);
      await this.repo.save(user);

      return successRes(user);
    } catch (error) {
      throw ErrorHender(error);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.repo.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`User with id: ${id} not found`);
      }

      await this.repo.delete(id);

      return successRes({}, 200);
    } catch (error) {
      throw ErrorHender(error);
    }
  }
}
