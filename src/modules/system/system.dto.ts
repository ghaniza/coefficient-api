import { IsString } from 'class-validator';

export class CreateSystemDTO {
  @IsString()
  code: string;
}
