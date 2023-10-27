import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private hash(plain: string, salt: string) {
    return crypto
      .pbkdf2Sync(plain, salt, 100_000, 64, 'sha256')
      .toString('base64');
  }

  public async signIn(username: string, password: string, scopes: string[]) {
    if (!username || !password || !scopes || !scopes.length)
      throw new UnauthorizedException();

    const user = await this.userService.getUserAuth(username);

    if (!user) throw new UnauthorizedException();

    const hash = this.hash(password, user.unique);

    if (hash !== user.password) throw new UnauthorizedException();

    await this.userService.setUserStatus(user.id);

    const payload = {
      access_token: await this.jwtService.signAsync(
        {
          aud: 'ACCESS',
          scopes,
        },
        {
          subject: user.id,
        },
      ),
      refresh_token: await this.jwtService.signAsync(
        {
          aud: 'REFRESH',
          scopes,
        },
        {
          subject: user.id,
        },
      ),
      exp: Date.now() + 60_000,
      type: 'bearer',
    };

    return {
      user,
      payload,
    };
  }

  public async signOff(userId: string) {
    await this.userService.setUserStatus(userId, false);
  }

  public async validateCredentials(authorization: string) {
    return this.jwtService.verify(authorization);
  }
}
