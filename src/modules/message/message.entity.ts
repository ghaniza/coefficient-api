import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { File } from '../file/file.entity';
import { AudioClip } from '../audio-clip/audio-clip.entity';
import { Chat } from '../chat/chat.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  from: User;

  @CreateDateColumn()
  timestamp: Date;

  @OneToMany(() => File, (file) => file.message)
  files: File[];

  @OneToOne(() => AudioClip)
  audioClip?: AudioClip;

  @ManyToOne(() => Chat)
  chat: Chat;

  @Column()
  content: string;
}
