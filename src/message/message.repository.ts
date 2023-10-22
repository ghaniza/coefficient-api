import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessageRepository extends Repository<Message> {
  constructor(@InjectRepository(Message) repository: Repository<Message>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
