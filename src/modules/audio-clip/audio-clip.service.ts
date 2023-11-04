import { Injectable } from '@nestjs/common';
import { AudioClipRepository } from './audio-clip.repository';
import { CreateAudioClipDTO } from './audio-clip.dto';

@Injectable()
export class AudioClipService {
  constructor(private readonly audioClipRepository: AudioClipRepository) {}

  public async createAudioClip(
    audioClipParams: CreateAudioClipDTO,
    messageId: string,
  ) {
    const audioClip = this.audioClipRepository.create({
      value: audioClipParams.value,
      mimeType: audioClipParams.mimeType,
      length: audioClipParams.length,
      message: { id: messageId },
    });

    return this.audioClipRepository.save(audioClip);
  }
}
