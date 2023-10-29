import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  private async signIn(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('scopes') scopes: string[],
    @Res({ passthrough: true }) response: Response,
  ) {
    const { payload, user } = await this.authService.signIn(
      username,
      password,
      scopes,
    );

    response.cookie('uid', user.id, {
      maxAge: 86400000,
      httpOnly: true,
      sameSite: 'none',
    });
    response.json(payload);
  }

  @Throttle({ default: { limit: 1, ttl: 60_000 } })
  @HttpCode(204)
  @Post('authorization-code')
  private async sendAuthorizationCode() {
    return this.authService.sendAuthorizationCode();
  }

  @UseGuards(AuthGuard)
  @Post('logoff')
  private async signOff(@Req() request: Request) {
    return this.authService.signOff((request as any).user.sub);
  }
}
