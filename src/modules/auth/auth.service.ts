import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { SystemService } from '../system/system.service';
import { System } from '../system/system.entity';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => SystemService))
    private readonly systemService: SystemService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {}

  private hash(plain: string, salt: string, length = 64) {
    return crypto
      .pbkdf2Sync(plain, salt, 100_000, length, 'sha256')
      .toString('base64');
  }

  public async makeUserAuthentication(password: string) {
    const unique = crypto.randomBytes(32).toString('base64');
    const hash = this.hash(password, unique);

    return {
      unique,
      password: hash,
    };
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

  public async resetPasswordAuthorization(email: string, expiresIn = '15m') {
    return this.jwtService.signAsync(
      {
        aud: 'RESET_PW',
      },
      {
        subject: email,
        expiresIn,
      },
    );
  }

  public async signOff(userId: string) {
    await this.userService.setUserStatus(userId, false);
  }

  public async validateCredentials(authorization: string) {
    return this.jwtService.verify(authorization);
  }

  public createAuthorizationCode() {
    const salt = this.configService.get('SIGNATURE_SECRET');
    const id = Date.now().toString();
    const sig = this.hash(id, salt, 8);

    return Buffer.from(`${id}.${sig}`).toString('base64url');
  }

  public validateAuthorizationCode(code: string) {
    const salt = this.configService.get('SIGNATURE_SECRET');
    const authExpirationMs = this.configService.get('AUTH_CODE_EXP');

    const [id, sig] = Buffer.from(code, 'base64url').toString().split('.');
    const checkSig = this.hash(id, salt, 8);

    if (parseInt(id) + parseInt(authExpirationMs) < Date.now()) return false;

    return sig === checkSig;
  }

  public async sendAuthorizationCode() {
    const code = this.createAuthorizationCode();

    if (this.configService.get('NODE_ENV') === 'production')
      await this.emailService.sendAuthorizationCode(code);

    this.loggerService.log(`Authorization code: ${code}`, 'Authorization');
  }

  public generateAPIToken(system: System) {
    const header = `${system.code}.${crypto
      .randomBytes(8)
      .toString('base64url')}`;
    const signature = this.hash(header, system.unique, 8);
    return Buffer.from(`${header}.${signature}`).toString('base64url');
  }

  public async validateAPIToken(token: string) {
    try {
      const [code, random, signature] = Buffer.from(token, 'base64url')
        .toString()
        .split('.');

      const system = await this.systemService.getSystemByCode(code);

      if (!system) return null;

      const hash = this.hash(`${code}.${random}`, system.unique, 8);

      if (hash !== signature) return null;

      return system;
    } catch {
      return null;
    }
  }

  public async validateUser(userId: string) {
    return this.userService.getUserById(userId);
  }
}