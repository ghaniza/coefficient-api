import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVersionDTO, VersionDTO } from './binary.dto';
import { BinaryArch, BinaryTarget } from './binary.constants';
import { BinaryRepository } from './binary.repository';
import parseVersion from '../../helpers/parse-version';
import { MoreThan } from 'typeorm';

@Injectable()
export class BinaryService {
  constructor(private readonly binaryRepository: BinaryRepository) {}

  public async checkForVersion(
    target: BinaryTarget,
    arch: BinaryArch,
    version: string,
  ): Promise<VersionDTO> {
    const semver = parseVersion(version);
    let bin = await this.binaryRepository.findOne({
      where: {
        target,
        arch,
        major: semver.major,
        minor: MoreThan(semver.minor),
        build: null,
        release: null,
      },
    });

    if (!bin)
      bin = await this.binaryRepository.findOne({
        where: {
          target,
          arch,
          major: semver.major,
          minor: semver.minor,
          patch: MoreThan(semver.patch),
          build: null,
          release: null,
        },
      });

    if (!bin) throw new HttpException({}, HttpStatus.NO_CONTENT);

    return {
      version: `${bin.major}.${bin.minor}.${bin.patch}`,
      url: bin.url,
      signature: bin.signature,
      pub_date: bin.publicationDate,
      notes: bin.notes,
    };
  }

  public async createVersion(createVersion: CreateVersionDTO) {
    const { version, ...createParams } = createVersion;

    const semver = parseVersion(version);

    const bin = this.binaryRepository.create({
      ...semver,
      ...createParams,
    });

    return this.binaryRepository.save(bin);
  }
}
