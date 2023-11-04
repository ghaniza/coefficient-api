import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from '../message/message.entity';

@Entity()
export class AudioClip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: string;

  @Column()
  mimeType: string;

  @Column()
  length: number;

  @JoinColumn()
  @OneToOne(() => Message)
  message: Message;
}
