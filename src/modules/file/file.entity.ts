import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from '../message/message.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mimeType: string;

  @Column()
  key: string;

  @Column()
  size: number;

  @ManyToOne(() => Message)
  message: Message;
}
