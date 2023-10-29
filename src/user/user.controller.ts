import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserParamsDTO } from './user.dto';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { UserId } from '../decorators/user.decorator';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  private async getViewer(@Req() request: Request) {
    return this.userService.getUserById((request as any).user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('find')
  private async findUser(
    @UserId() userId: string,
    @Query('q') query: string,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: number,
  ) {
    return this.userService.findUsers(query, userId, limit, cursor);
  }

  @Get('reset-password')
  @Header('Content-type', 'text/html')
  private async resetPasswordConfirm(@Query('t') token: string) {
    return this.userService.resetPasswordConfirm(token);
  }

  @Get('reset-success')
  @Header('Content-type', 'text/html')
  private async resetPasswordSuccess() {
    return this.userService.resetPasswordSuccess();
  }

  @UseGuards(AuthGuard)
  @Get(':userId')
  private async getUserById(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.getUserById(userId);
  }

  @HttpCode(204)
  @Post('reset-password')
  private async resetPassword(@Query('email') email: string) {
    return this.userService.resetPassword(email);
  }

  @Post('new-password')
  @Redirect('reset-success')
  private async setNewPassword(@Body() resetPasswordParams: any) {
    return this.userService.setNewPassword(resetPasswordParams);
  }

  @Post()
  private async createUser(@Body() createUserParamsDTO: CreateUserParamsDTO) {
    return this.userService.createUser(createUserParamsDTO);
  }
}
