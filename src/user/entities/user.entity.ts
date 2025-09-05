import { Entity, Column } from 'typeorm';
import { Role } from '../../common/enum/user-enum';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'password' })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: string;

  @Column({ type: 'boolean', name: 'is_verified', default: false })
  isVerified: boolean;
}
