import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BinaryArch, BinaryTarget } from './binary.constants';

@Entity()
export class Binary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  major: number;

  @Column()
  minor: number;

  @Column()
  patch: number;

  @Column({ nullable: true })
  release?: string;

  @Column({ nullable: true })
  build?: string;

  @Column({ enum: BinaryArch })
  arch: string;

  @Column({ enum: BinaryTarget })
  target: string;

  @Column()
  url: string;

  @Column()
  signature: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: 'timestamptz' })
  publicationDate: Date;
}
