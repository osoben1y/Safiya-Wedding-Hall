import { Entity, Column } from 'typeorm';
import { Role } from '../../common/enum/user-enum';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('admin')
export class AdminEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'password' })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.ADMIN })
  role: string;
}
