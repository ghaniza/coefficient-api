import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MessageGateway } from './message.gateway';
import { ChatInteractionService } from '../chat-interaction/chat-interaction.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly messageGateway: MessageGateway,
    private readonly chatInteractionService: ChatInteractionService,
  ) {}

  public async registerMessage(
    chatId: string,
    content: string,
    fromId: string,
  ) {
    const message = this.messageRepository.create({
      from: { id: fromId },
      chat: { id: chatId },
      content,
    });

    const saved = await this.messageRepository.save(message);

    const response = await this.messageRepository.findOne({
      where: { id: saved.id },
      relations: ['from', 'chat'],
    });

    await this.messageGateway.emitMessage(chatId, response);
    await this.chatInteractionService.updateInteraction(chatId, fromId);

    return response;
  }

  public async getChatMessages(chatId: string, cursor: number = 0) {
    return this.messageRepository.find({
      where: {
        chat: { id: chatId },
      },
      skip: cursor,
      take: 15,
      order: {
        timestamp: 'DESC',
      },
      relations: ['from'],
    });
  }
}
