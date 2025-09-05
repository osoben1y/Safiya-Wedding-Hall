import { Entity } from "typeorm";
import { BaseEntity } from "../../common/database/base.entity";
import { Role } from "../../common/enum/user-enum";
import { Column } from "typeorm";

@Entity('superadmin')
export class SuperadminEntity extends BaseEntity {
    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.SUPERADMIN })
    role: Role;
}
