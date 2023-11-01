import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsSemVer,
  IsString,
  IsUrl,
} from 'class-validator';
import { Body } from '@nestjs/common';
import { BinaryArch, BinaryTarget } from './binary.constants';

export class VersionDTO {
  @IsSemVer()
  version: string;

  @IsUrl()
  url: string;

  @IsString()
  signature: string;

  @IsOptional()
  @IsDateString()
  pub_date?: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateVersionDTO {
  @IsEnum(BinaryTarget)
  target: BinaryTarget;

  @IsEnum(BinaryArch)
  arch: BinaryArch;

  @IsSemVer()
  version: string;

  @IsString()
  signature: string;

  @IsDateString()
  publicationDate: Date;

  @IsUrl()
  url: string;

  @IsString()
  @IsString()
  notes?: string;
}
