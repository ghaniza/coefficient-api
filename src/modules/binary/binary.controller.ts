import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BinaryService } from './binary.service';
import { BinaryArch, BinaryTarget } from './binary.constants';
import { AuthSystemGuard } from '../auth/auth.system.guard';
import { RequestSystem } from '../../decorators/system.decorator';
import type { SystemDTO } from '../../../types/system.dto';
import { AuthUserGuard } from '../auth/auth.user.guard';
import { CreateVersionDTO } from './binary.dto';

@Controller({ path: 'binaries', version: '1' })
export class BinaryController {
  constructor(private readonly binaryService: BinaryService) {}

  @Get(':target/:arch/:currentVersion')
  private async checkForVersion(
    @Param('target') target: BinaryTarget,
    @Param('arch') arch: BinaryArch,
    @Param('currentVersion') currentVersion: string,
  ) {
    return this.binaryService.checkForVersion(target, arch, currentVersion);
  }

  @UseGuards(AuthUserGuard, AuthSystemGuard)
  @Post()
  private async createVersion(
    @RequestSystem() system: SystemDTO,
    @Body() createVersion: CreateVersionDTO,
  ) {
    return this.binaryService.createVersion(createVersion);
  }
}
