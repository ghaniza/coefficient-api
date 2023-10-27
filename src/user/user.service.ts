import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserParamsDTO } from './user.dto';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(createUserParamsDTO: CreateUserParamsDTO) {
    const user = this.userRepository.create(createUserParamsDTO);

    user.unique = crypto.randomBytes(32).toString('base64');
    user.password = crypto
      .pbkdf2Sync(
        createUserParamsDTO.password,
        user.unique,
        100_000,
        64,
        'sha256',
      )
      .toString('base64');
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

    if (online) user.lastOnline = new Date();

    return this.userRepository.save(user);
  }
}
