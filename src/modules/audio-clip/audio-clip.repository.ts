import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AudioClip } from './audio-clip.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AudioClipRepository extends Repository<AudioClip> {
  constructor(@InjectRepository(AudioClip) repository: Repository<AudioClip>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
