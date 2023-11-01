import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class System {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  code: string;

  @Column()
  unique: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamptz' })
  lastRotatedAt: Date;
}
