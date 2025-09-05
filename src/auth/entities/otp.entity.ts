import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('otp')
export class OtpEntity extends BaseEntity {
  @Index('idx_otp_email')
  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @Column({ type: 'varchar', name: 'code' })
  code: string;

  @Column({ type: 'timestamptz', name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'int', name: 'attempts', default: 0 })
  attempts: number;

  @Column({ type: 'boolean', name: 'verified', default: false })
  verified: boolean;

  @Column({ type: 'jsonb', name: 'payload', nullable: true })
  payload?: Record<string, any> | null;
}
