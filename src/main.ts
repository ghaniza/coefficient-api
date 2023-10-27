import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['verbose'],
  });
  app.enableVersioning({ type: VersioningType.URI });
  app.enableCors({
    origin: ['http://localhost:5001', 'https://tauri.localhost'],
  });
  app.useLogger(app.get(LoggerService));
  await app.listen(3000);
}

bootstrap();
