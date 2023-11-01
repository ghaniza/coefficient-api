import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SystemService } from './system.service';
import { AuthSystemGuard } from '../auth/auth.system.guard';
import { System } from './system.entity';
import { RequestSystem } from '../../decorators/system.decorator';
import { AuthUserGuard } from '../auth/auth.user.guard';

@Controller({ path: 'system', version: '1' })
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @UseGuards(AuthSystemGuard)
  @Get()
  private async getViewer(@RequestSystem() system: System) {
    return system;
  }

  @UseGuards(AuthUserGuard)
  @Post()
  private async createSystem(@Body('code') code: string) {
    return this.systemService.createSystem(code);
  }
}
