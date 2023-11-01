import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { NotificationModule } from './modules/notification/notification.module';
import { LoggerModule } from './modules/logger/logger.module';
import { MessageModule } from './modules/message/message.module';
import { FileModule } from './modules/file/file.module';
import { AudioClipModule } from './modules/audio-clip/audio-clip.module';
import { ChatModule } from './modules/chat/chat.module';
import { ChatInteractionModule } from './modules/chat-interaction/chat-interaction.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './modules/logger/logger.middleware';
import { EmailModule } from './modules/email/email.module';
import { BinaryModule } from './modules/binary/binary.module';
import { SystemModule } from './modules/system/system.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        ssl: configService.get('NODE_ENV') === 'production',
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 1000,
      },
    ]),
    LoggerModule,
    UserModule,
    NotificationModule,
    MessageModule,
    FileModule,
    AudioClipModule,
    ChatModule,
    ChatInteractionModule,
    AuthModule,
    EmailModule,
    BinaryModule,
    SystemModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
