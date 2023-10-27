import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessageGateway } from './message.gateway';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageRepository } from './message.repository';
import { ChatInteractionModule } from '../chat-interaction/chat-interaction.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ChatInteractionModule],
  controllers: [MessageController],
  providers: [MessageGateway, MessageService, MessageRepository],
  exports: [MessageService],
})
export class MessageModule {}
