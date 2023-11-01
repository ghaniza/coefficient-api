import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LoggerService } from '../logger/logger.service';
import { Message } from './message.entity';
import { AuthService } from '../auth/auth.service';
import { ChatInteractionService } from '../chat-interaction/chat-interaction.service';

@WebSocketGateway({
  transports: ['polling', 'websocket'],
  cors: { origin: ['http://localhost:5001', 'https://tauri.localhost'] },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly logger: LoggerService,
    private readonly authService: AuthService,
    private readonly chatInteractionService: ChatInteractionService,
  ) {}

  @SubscribeMessage('ping')
  private async handleEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): Promise<void> {
    this.logger.debug('ping');
    client.emit('pong', 'response ' + data);
  }

  @SubscribeMessage('ack')
  private async handleAck(
    @ConnectedSocket() client: Socket,
    @MessageBody('chatId') chatId: string,
  ) {
    const { authorization } = client.request.headers;
    if (!authorization) return false;

    const payload = await this.authService.validateCredentials(
      authorization.substring(7),
    );

    this.logger.debug('Ack ' + chatId, 'Message');
    await this.chatInteractionService.updateInteraction(chatId, payload.sub);
  }

  @SubscribeMessage('join-chat')
  private async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody('chatId') chatId: string,
  ): Promise<void> {
    const roomId = `chat-${chatId}`;

    for (const room of Array.from(client.rooms.values())) {
      if (room.startsWith('chat-')) {
        await client.leave(room);
      }
    }

    await client.join(roomId);
    this.logger.debug(`Joined "${roomId}"`);
    this.server.to(roomId).emit('user-joined', {});
  }

  public async emitMessage(chatId: string, message: Message) {
    this.server.to(`chat-${chatId}`).emit('message', message);
  }

  public handleConnection(client: Socket): any {
    this.logger.debug('Connected: ' + client.id, 'Message');
  }

  public handleDisconnect(client: Socket): any {
    this.logger.debug('Disconnect: ' + client.id, 'Message');
  }
}
