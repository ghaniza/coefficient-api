import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Request, Response } from 'express';

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

  @UseGuards(AuthGuard)
  @Post('logoff')
  private async signOff(@Req() request: Request) {
    return this.authService.signOff((request as any).user.sub);
  }
}
