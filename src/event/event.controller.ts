import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enum/user-enum';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi event yaratish' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: 'Event yaratildi' })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha eventlarni olish' })
  @ApiResponse({ status: 200, description: 'Eventlar ro‘yxati' })
  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN)
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta eventni olish' })
  @ApiParam({ name: 'id', type: Number, description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'Event topildi' })
  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN)
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Eventni yangilash' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, description: 'Event yangilandi' })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eventni o‘chirish' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Event o‘chirildi' })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
