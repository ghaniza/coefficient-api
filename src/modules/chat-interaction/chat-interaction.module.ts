import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatInteraction } from './chat-interaction.entity';
import { ChatInteractionService } from './chat-interaction.service';
import { ChatInteractionRepository } from './chat-interaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChatInteraction])],
  providers: [ChatInteractionService, ChatInteractionRepository],
  exports: [ChatInteractionService],
})
export class ChatInteractionModule {}
