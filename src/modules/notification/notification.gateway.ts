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
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  transports: ['polling', 'websocket'],
  cors: { origin: ['http://localhost:5001', 'https://tauri.localhost'] },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @SubscribeMessage('ping')
  private async handleEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): Promise<void> {
    client.emit('pong', 'response ' + data);
  }

  public async emitChatUpdateNotification(
    chatId: string,
    userIds: string[],
    fromId: string,
  ) {
    for (const userId of userIds) {
      this.server
        .to(`notification-${userId}`)
        .emit('chat-update', { chatId, fromId });
    }
  }

  public async emitChatAckNotification(
    chatId: string,
    userIds: string[],
    fromId: string,
  ) {
    for (const userId of userIds) {
      this.server
        .to(`notification-${userId}`)
        .emit('chat-ack', { chatId, fromId });
    }
  }

  public async handleConnection(client: Socket) {
    const { authorization } = client.request.headers;

    const payload = await this.authService.validateCredentials(
      authorization.substring(7),
    );
    await this.userService.setUserStatus(payload.sub, true);
    this.logger.debug('Connected: ' + client.id, 'Notification');
    await client.join(`notification-${payload.sub}`);
    this.server.emit('user-connected', { userId: payload.sub });
  }

  public async handleDisconnect(client: Socket) {
    const { authorization } = client.request.headers;
    if (!authorization) return false;

    const payload = await this.authService.validateCredentials(
      authorization.substring(7),
    );
    await this.userService.setUserStatus(payload.sub, false);
    this.logger.debug('Disconnect: ' + client.id, 'Notification');
    this.server.emit('user-disconnected', { userId: payload.sub });
  }
}
