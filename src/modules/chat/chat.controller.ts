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
import { ChatService } from './chat.service';
import { CreateChatParamsDTO } from './chat.dto';
import { AuthUserGuard } from '../auth/auth.user.guard';
import { RequestUser } from '../../decorators/user.decorator';
import type { UserDTO } from '../../../types/user.dto';

@Controller({ path: 'chat', version: '1' })
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':chatId')
  private async getChatById(@Param('chatId', ParseUUIDPipe) chatId: string) {
    return this.chatService.getChatById(chatId);
  }

  @UseGuards(AuthUserGuard)
  @Get()
  private async getAllChatData(
    @Query('unread') unread: string,
    @Req() request: any,
  ) {
    return this.chatService.getChatData(request.user.sub, unread === 'true');
  }

  @UseGuards(AuthUserGuard)
  @Post()
  private async createChat(
    @Body() createChatParamsDTO: CreateChatParamsDTO,
    @RequestUser() user: UserDTO,
  ) {
    return this.chatService.createChat(createChatParamsDTO, user.id);
  }
}
