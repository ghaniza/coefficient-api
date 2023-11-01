import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { CreateChatParamsDTO } from './chat.dto';
import { ChatInteractionService } from '../chat-interaction/chat-interaction.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly chatInteractionService: ChatInteractionService,
  ) {}

  public async createChat(
    createChatParamsDTO: CreateChatParamsDTO,
    userId: string,
  ) {
    if (createChatParamsDTO.userIds.includes(userId))
      throw new BadRequestException();

    const chat = await this.chatRepository.save(this.chatRepository.create());
    const participants =
      await this.chatInteractionService.createChatInteractions(
        [...createChatParamsDTO.userIds, userId],
        chat.id,
      );

    return { ...chat, participants };
  }

  public async getChatById(chatId: string) {
    const chat = this.chatRepository.findOne({
      where: {
        id: chatId,
      },
      relations: [
        'messages',
        'participants',
        'participants.user',
        'messages.from',
      ],
    });

    if (!chat) throw new NotFoundException();

    return chat;
  }

  public async getChatData(userId: string, unreadOnly?: boolean) {
    return this.chatRepository.getChatData(userId, unreadOnly);
  }
}
