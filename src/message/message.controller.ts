import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller({ path: 'message', version: '1' })
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post(':chatId')
  private async registerMessage(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Body('message') message: string,
    @Body('fromId', ParseUUIDPipe) fromId: string,
  ) {
    return this.messageService.registerMessage(chatId, message, fromId);
  }
}
