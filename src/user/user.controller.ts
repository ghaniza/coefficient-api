import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateUserParamsDTO } from './user.dto';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  private async getUserById(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.getUserById(userId);
  }

  @Post()
  private async createUser(@Body() createUserParamsDTO: CreateUserParamsDTO) {
    return this.userService.createUser(createUserParamsDTO);
  }
}
