import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Binary } from './binary.entity';

@Injectable()
export class BinaryRepository extends Repository<Binary> {
  constructor(@InjectRepository(Binary) repository: Repository<Binary>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
