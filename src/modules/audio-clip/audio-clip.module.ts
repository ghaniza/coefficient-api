import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioClip } from './audio-clip.entity';
import { AudioClipService } from './audio-clip.service';
import { AudioClipRepository } from './audio-clip.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AudioClip])],
  providers: [AudioClipService, AudioClipRepository],
  exports: [AudioClipService],
})
export class AudioClipModule {}
