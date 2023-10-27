import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller({ path: 'message', version: '1' })
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthGuard)
  @Post(':chatId/ack')
  private async registerAck(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Req() request: Request,
  ) {
    return this.messageService.registerAck(chatId, (request as any).user.sub);
  }

  @UseGuards(AuthGuard)
  @Post(':chatId')
  private async registerMessage(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Body('message') message: string,
    @Req() request: Request,
  ) {
    return this.messageService.registerMessage(
      chatId,
      message,
      (request as any).user.sub,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':chatId')
  private async getChatMessages(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Query('cursor') cursor: number,
  ) {
    return this.messageService.getChatMessages(chatId, cursor);
  }
}
