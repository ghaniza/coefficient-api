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
  UseGuards,
} from '@nestjs/common';
import { CreateUserParamsDTO } from './user.dto';
import { AuthUserGuard } from '../auth/auth.user.guard';
import { RequestUser } from '../../decorators/user.decorator';
import type { UserDTO } from '../../../types/user.dto';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthUserGuard)
  @Get()
  private async getViewer(@RequestUser() user: UserDTO) {
    return user;
  }

  @UseGuards(AuthUserGuard)
  @Get('find')
  private async findUser(
    @RequestUser() user: UserDTO,
    @Query('q') query: string,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: number,
  ) {
    return this.userService.findUsers(query, user.id, limit, cursor);
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

  @UseGuards(AuthUserGuard)
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
