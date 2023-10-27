import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserParamsDTO } from './user.dto';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  private async getViewer(@Req() request: Request) {
    return this.userService.getUserById((request as any).user.sub);
  }

  @Get(':userId')
  private async getUserById(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.getUserById(userId);
  }

  @Post()
  private async createUser(@Body() createUserParamsDTO: CreateUserParamsDTO) {
    return this.userService.createUser(createUserParamsDTO);
  }
}
