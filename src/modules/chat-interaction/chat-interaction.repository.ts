import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatInteraction } from './chat-interaction.entity';

@Injectable()
export class ChatInteractionRepository extends Repository<ChatInteraction> {
  constructor(
    @InjectRepository(ChatInteraction) repository: Repository<ChatInteraction>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
