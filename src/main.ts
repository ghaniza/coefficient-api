import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggerService } from './modules/logger/logger.service';

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
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get('PORT'));
}

bootstrap().catch(console.error);
