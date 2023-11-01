import { Repository } from 'typeorm';
import { System } from './system.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class SystemRepository extends Repository<System> {
  constructor(@InjectRepository(System) repository: Repository<System>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
