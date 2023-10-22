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

@WebSocketGateway({
  transports: ['polling', 'websocket'],
  cors: { origin: ['http://localhost:5001', 'https://tauri.localhost'] },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly logger: LoggerService) {}

  @SubscribeMessage('ping')
  private async handleEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): Promise<void> {
    this.logger.debug('ping');
    client.emit('pong', 'response ' + data);
  }

  @SubscribeMessage('join-chat')
  private async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody('chatId') chatId: string,
  ): Promise<void> {
    const roomId = `chat-${chatId}`;

    if (Array.from(client.rooms.values()).find((room) => room === roomId))
      return;

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
