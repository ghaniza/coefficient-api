import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['verbose'],
  });

  const configService = app.get(ConfigService);

  app.enableVersioning({ type: VersioningType.URI });
  app.enableCors({
    origin: configService.get('ORIGINS').split(';'),
  });
  app.useLogger(app.get(LoggerService));
  await app.listen(configService.get('PORT'));
}

bootstrap();
