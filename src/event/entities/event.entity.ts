import { Entity, Column } from "typeorm";
import { BaseEntity } from "../../common/database/base.entity";
import { Event } from "../../common/enum/event-enum";

@Entity('event')
export class EventEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: Event,
    default: Event.Toy,
  })
  event_name: Event;

  @Column({ type: 'int', name: 'number_of_guests' })
  number_of_guests: number;

  @Column({ type: 'int', name: 'number_of_waiters' })
  number_of_waiters: number;

  @Column({ type: 'varchar', name: 'date' })
  date: string;
}
