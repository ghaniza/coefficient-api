import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserParamsDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(createUserParamsDTO: CreateUserParamsDTO) {
    const user = this.userRepository.create(createUserParamsDTO);
    return this.userRepository.save(user);
  }

  public async getUserById(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException();

    return user;
  }
}
