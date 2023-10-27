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
import * as cookie from 'cookie';

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

  public async handleConnection(client: Socket) {
    if (!client.request.headers.cookie) return false;

    this.logger.debug('Connected: ' + client.id, 'Notification');
    const { uid } = cookie.parse(client.request.headers.cookie);
    await this.userService.setUserStatus(uid, false);
  }

  public async handleDisconnect(client: Socket) {
    if (!client.request.headers.cookie) return false;

    this.logger.debug('Disconnect: ' + client.id, 'Notification');
    const { uid } = cookie.parse(client.request.headers.cookie);
    await this.userService.setUserStatus(uid, false);
  }
}
