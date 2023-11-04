import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MessageGateway } from './message.gateway';
import { ChatInteractionService } from '../chat-interaction/chat-interaction.service';
import { NotificationGateway } from '../notification/notification.gateway';
import { AudioClipService } from '../audio-clip/audio-clip.service';
import { CreateAudioClipDTO } from '../audio-clip/audio-clip.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly messageGateway: MessageGateway,
    private readonly notificationGateway: NotificationGateway,
    private readonly chatInteractionService: ChatInteractionService,
    private readonly audioClipService: AudioClipService,
  ) {}

  public async registerMessage(
    chatId: string,
    fromId: string,
    content?: string,
    audioClip?: CreateAudioClipDTO,
  ) {
    const message = this.messageRepository.create({
      from: { id: fromId },
      chat: { id: chatId },
      content,
    });

    const saved = await this.messageRepository.save(message);

    if (audioClip) {
      await this.audioClipService.createAudioClip(audioClip, saved.id);
    }

    const response = await this.messageRepository.findOne({
      where: { id: saved.id },
      relations: ['from', 'chat', 'audioClip'],
    });
    const users = await this.chatInteractionService.getChatParticipants(chatId);

    await this.messageGateway.emitMessage(chatId, response);
    await this.notificationGateway.emitChatUpdateNotification(
      chatId,
      users.map((user) => user.id),
      fromId,
    );
    await this.chatInteractionService.updateInteraction(chatId, fromId);

    return response;
  }

  public async getChatMessages(chatId: string, cursor = 0, limit = 10) {
    return this.messageRepository.find({
      where: {
        chat: { id: chatId },
      },
      skip: cursor,
      take: limit,
      order: {
        timestamp: 'DESC',
      },
      relations: ['from', 'audioClip'],
    });
  }

  public async registerAck(chatId: string, userId: string) {
    await this.chatInteractionService.updateInteraction(chatId, userId);
    const users = await this.chatInteractionService.getChatParticipants(chatId);
    await this.notificationGateway.emitChatAckNotification(
      chatId,
      users.map((user) => user.id),
      userId,
    );
    return { status: 'ok' };
  }
}
