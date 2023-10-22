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

@WebSocketGateway({
  transports: ['polling', 'websocket'],
  cors: { origin: ['http://localhost:5001', 'https://tauri.localhost'] },
})
export class NotificationGateway
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
    client.emit('pong', 'response ' + data);
  }

  public handleConnection(client: Socket): any {
    this.logger.debug('Connected: ' + client.id, 'Notification');
  }

  public handleDisconnect(client: Socket): any {
    this.logger.debug('Disconnect: ' + client.id, 'Notification');
  }
}
