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
import { AuthGuard } from '../auth/auth.guard';
import { UserId } from '../decorators/user.decorator';

@Controller({ path: 'chat', version: '1' })
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':chatId')
  private async getChatById(@Param('chatId', ParseUUIDPipe) chatId: string) {
    return this.chatService.getChatById(chatId);
  }

  @UseGuards(AuthGuard)
  @Get()
  private async getAllChatData(
    @Query('unread') unread: string,
    @Req() request: any,
  ) {
    return this.chatService.getChatData(request.user.sub, unread === 'true');
  }

  @UseGuards(AuthGuard)
  @Post()
  private async createChat(
    @Body() createChatParamsDTO: CreateChatParamsDTO,
    @UserId() userId: string,
  ) {
    return this.chatService.createChat(createChatParamsDTO, userId);
  }
}
