import { Module } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { SuperadminController } from './superadmin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperadminEntity } from './entities/superadmin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SuperadminEntity])],
  controllers: [SuperadminController],
  providers: [SuperadminService],
})
export class SuperadminModule {}
