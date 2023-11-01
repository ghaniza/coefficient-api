import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SystemModule } from '../system/system.module';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.getOrThrow('ACCESS_SECRET'),
        signOptions: { expiresIn: '8h' },
      }),
      global: true,
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
    forwardRef(() => SystemModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
