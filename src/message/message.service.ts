import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MessageGateway } from './message.gateway';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly messageGateway: MessageGateway,
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

    return response;
  }
}
