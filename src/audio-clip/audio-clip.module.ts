import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioClip } from './audio-clip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AudioClip])],
})
export class AudioClipModule {}
