import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthUserGuard } from '../auth/auth.user.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { RequestUser } from '../../decorators/user.decorator';
import type { UserDTO } from '../../../types/user.dto';
import { CreateAudioClipDTO } from '../audio-clip/audio-clip.dto';

@Controller({ path: 'message', version: '1' })
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  //TODO Move to Chat Module
  @UseGuards(AuthUserGuard)
  @Post('/by-chat/:chatId/ack')
  private async registerAck(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @RequestUser() user: UserDTO,
  ) {
    return this.messageService.registerAck(chatId, user.id);
  }

  @SkipThrottle()
  @UseGuards(AuthUserGuard)
  @Post('/by-chat/:chatId')
  private async registerMessage(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @RequestUser() user: UserDTO,
    @Body('message') message?: string,
    @Body('audioClip') audioClip?: CreateAudioClipDTO,
  ) {
    return this.messageService.registerMessage(
      chatId,
      user.id,
      message,
      audioClip,
    );
  }

  @SkipThrottle()
  @UseGuards(AuthUserGuard)
  @Get('/by-chat/:chatId')
  private async getChatMessages(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Query('cursor') cursor: number,
  ) {
    return this.messageService.getChatMessages(chatId, cursor);
  }
}
