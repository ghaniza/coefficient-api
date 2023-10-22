import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from '../message/message.entity';

@Entity()
export class AudioClip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: string;

  @ManyToOne(() => Message)
  message: Message;
}
