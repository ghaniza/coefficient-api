import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BinaryService } from './binary.service';
import { BinaryController } from './binary.controller';
import { Binary } from './binary.entity';
import { BinaryRepository } from './binary.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Binary])],
  controllers: [BinaryController],
  providers: [BinaryService, BinaryRepository],
  exports: [BinaryService],
})
export class BinaryModule {}
