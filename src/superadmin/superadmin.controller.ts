import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { LoginSuperadminDto } from './dto/login-superadmin.dto';
import { Roles } from '../common/decorator/roles.decorator';
import { Role } from '../common/enum/user-enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Superadmin')
@ApiBearerAuth()
@Controller('superadmin')
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @Get()
  @Roles(Role.SUPERADMIN)
  findAll() {
    return this.superadminService.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPERADMIN)
  findOne(@Param('id') id: string) {
    return this.superadminService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN)
  update(@Param('id') id: string, @Body() updateSuperadminDto: LoginSuperadminDto) {
    return this.superadminService.update(+id, updateSuperadminDto);
  }
}
