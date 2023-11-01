import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SystemRepository } from './system.repository';
import { AuthService } from '../auth/auth.service';
import * as crypto from 'crypto';

@Injectable()
export class SystemService {
  constructor(
    private readonly systemRepository: SystemRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public async getSystemByCode(code: string) {
    return this.systemRepository.findOne({ where: { code } });
  }

  public async createSystem(code: string) {
    const system = this.systemRepository.create({
      code,
      unique: crypto.randomBytes(32).toString('base64url'),
      lastRotatedAt: new Date(),
    });

    const saved = await this.systemRepository.save(system);

    return {
      ...saved,
      unique: undefined,
      token: this.authService.generateAPIToken(saved),
    };
  }
}
