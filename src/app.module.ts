import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { LoggerModule } from './logger/logger.module';
import { MessageModule } from './message/message.module';
import { FileModule } from './file/file.module';
import { AudioClipModule } from './audio-clip/audio-clip.module';
import { ChatModule } from './chat/chat.module';
import { ChatInteractionModule } from './chat-interaction/chat-interaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    UserModule,
    NotificationModule,
    MessageModule,
    FileModule,
    AudioClipModule,
    ChatModule,
    ChatInteractionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
