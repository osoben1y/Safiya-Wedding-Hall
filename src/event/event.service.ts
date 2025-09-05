import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { Repository } from 'typeorm';
import { ErrorHender } from 'src/common/utils/error-handle';
import { successRes } from 'src/common/utils/success-response';

@Injectable()
export class EventService {
  constructor(@InjectRepository(EventEntity) private readonly repo: Repository<EventEntity>) { }

  async create(createEventDto: CreateEventDto) {
    try {
      const event = this.repo.create(createEventDto);
      await this.repo.save(event);

      return successRes(event, 201);
    } catch (error) {
      throw ErrorHender(error)
    }
  }

  async findAll() {
    try {
      const events = await this.repo.find();

      if (!events.length) {
        throw new NotFoundException('Events not found');
      }

      return successRes(events);
    } catch (error) {
      throw ErrorHender(error)
    }
  }

  async findOne(id: number) {
    try {
      const event = await this.repo.findOne({ where: { id } });

      if (!event) {
        throw new NotFoundException(`Event with id: ${id} not found`);
      }

      return successRes(event);
    } catch (error) {
      throw ErrorHender(error)
    }
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      const event = await this.repo.findOne({ where: { id } });

      if (!event) {
        throw new NotFoundException(`Event with id: ${id} not found`);
      }

      this.repo.merge(event, updateEventDto);
      await this.repo.save(event);

      return successRes(event);
    } catch (error) {
      throw ErrorHender(error)
    }
  }

  async remove(id: number) {
    try {
      const event = await this.repo.findOne({ where: { id } });

      if (!event) {
        throw new NotFoundException(`Event with id: ${id} not found`);
      }

      await this.repo.delete(id);

      return successRes({}, 200);
    } catch (error) {
      throw ErrorHender(error)
    }
  }
}
