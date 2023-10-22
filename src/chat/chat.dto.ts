import { User } from '../user/user.entity';
import { Message } from '../message/message.entity';

export class CreateChatParamsDTO {
  userIds: string[];
}

export class ChatDataDTO {
  participants: User[];
  lastMessage: Message;
  unreadMessageCount: number;
}
