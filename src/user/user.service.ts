import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserParamsDTO } from './user.dto';
import { ILike, Not } from 'typeorm';
import { EmailService } from '../email/email.service';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import * as ejs from 'ejs';
import * as path from 'path';
import * as process from 'process';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  public async createUser(createUserParamsDTO: CreateUserParamsDTO) {
    const { code, password, ...userParams } = createUserParamsDTO;

    if (!code || !this.authService.validateAuthorizationCode(code))
      throw new BadRequestException();

    const user = this.userRepository.create(userParams);

    const auth = await this.authService.makeUserAuthentication(password);

    user.unique = auth.unique;
    user.password = auth.password;
    user.passwordLastChangedAt = new Date();

    return this.userRepository.save(user);
  }

  public async getUserById(userId: string) {
    if (!userId) throw new NotFoundException();

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException();

    return user;
  }

  public async getUserAuth(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: { unique: true, password: true, id: true },
    });
  }

  public async setUserStatus(userId: string, online = true) {
    const user = await this.getUserById(userId);

    user.online = online;
    user.lastOnline = new Date();

    return this.userRepository.save(user);
  }

  public async findUsers(query: string, userId: string, cursor = 0, limit = 8) {
    return this.userRepository.find({
      where: [
        {
          id: Not(userId),
          name: ILike(`%${query}%`.trim().replaceAll(' ', '%')),
        },
        {
          id: Not(userId),
          email: ILike(`%${query}%`.trim().replaceAll(' ', '%')),
        },
      ],
      skip: cursor,
      take: limit,
    });
  }

  public async resetPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return;

    const token = await this.authService.resetPasswordAuthorization(user.email);
    const link = `${this.configService.get(
      'APP_BASE_URL',
    )}/v1/user/reset-password?t=${token}`;

    await this.emailService.sendResetPasswordEmail(email, user.name, link);
  }

  public async resetPasswordConfirm(token: string) {
    if (!token) throw new NotFoundException();

    return ejs.renderFile(
      path.join(process.cwd(), 'views', 'reset-password-confirm.ejs'),
      {
        token,
      },
    );
  }

  public async resetPasswordSuccess() {
    return ejs.renderFile(
      path.join(process.cwd(), 'views', 'reset-password-success.ejs'),
      {},
    );
  }

  public async setNewPassword(resetPasswordParams: any) {
    const { password, confirmPassword, token } = resetPasswordParams;

    if (!token) throw new BadRequestException('no_token');
    if (password !== confirmPassword)
      throw new BadRequestException('passwords_not_match');

    let payload: any;

    try {
      payload = await this.authService.validateCredentials(token);
    } catch {
      throw new BadRequestException();
    }

    if (payload.aud !== 'RESET_PW') throw new BadRequestException();

    const user = await this.userRepository.findOne({
      where: { email: payload.sub },
    });
    if (!user) throw new BadRequestException();

    const auth = await this.authService.makeUserAuthentication(password);
    user.password = auth.password;
    user.unique = auth.unique;

    await this.userRepository.save(user);
  }
}
