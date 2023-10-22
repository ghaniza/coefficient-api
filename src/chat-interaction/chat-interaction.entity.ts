import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from '../chat/chat.entity';
import { User } from '../user/user.entity';

@Entity()
export class ChatInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Chat)
  chat: Chat;

  @Column({ nullable: true })
  lastInteraction?: Date;
}
