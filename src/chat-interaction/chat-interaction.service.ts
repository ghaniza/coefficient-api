import { Injectable } from '@nestjs/common';
import { ChatInteractionRepository } from './chat-interaction.repository';
import { ChatInteraction } from './chat-interaction.entity';

@Injectable()
export class ChatInteractionService {
  constructor(
    private readonly chatInteractionRepository: ChatInteractionRepository,
  ) {}

  public async createChatInteractions(userIds: string[], chatId: string) {
    const entities: ChatInteraction[] = [];

    for (const userId of userIds) {
      entities.push(
        this.chatInteractionRepository.create({
          chat: { id: chatId },
          user: { id: userId },
          lastInteraction: new Date(new Date().toISOString()),
        }),
      );
    }

    return await this.chatInteractionRepository.save(entities);
  }

  public async updateInteraction(chatId: string, userId: string) {
    await this.chatInteractionRepository.update(
      {
        chat: { id: chatId },
        user: { id: userId },
      },
      { lastInteraction: new Date(new Date().toISOString()) },
    );
  }
}
