import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatParamsDTO } from './chat.dto';

@Controller({ path: 'chat', version: '1' })
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':chatId')
  private async getChatById(@Param('chatId', ParseUUIDPipe) chatId: string) {
    return this.chatService.getChatById(chatId);
  }

  @Get()
  private async getChatData() {
    return this.chatService.getChatData();
  }

  @Post()
  private async createChat(@Body() createChatParamsDTO: CreateChatParamsDTO) {
    return this.chatService.createChat(createChatParamsDTO);
  }
}
