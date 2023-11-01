import { forwardRef, Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { SystemRepository } from './system.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { System } from './system.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([System]), forwardRef(() => AuthModule)],
  controllers: [SystemController],
  providers: [SystemService, SystemRepository],
  exports: [SystemService],
})
export class SystemModule {}
