import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from '../message/message.entity';
import { ChatInteraction } from '../chat-interaction/chat-interaction.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => ChatInteraction, (ci) => ci.chat)
  participants: ChatInteraction[];

  @OneToMany(() => Message, (msg) => msg.chat)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
