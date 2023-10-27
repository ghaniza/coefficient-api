import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  online: boolean;

  @Column({ nullable: true, type: 'timestamptz' })
  lastOnline: Date;

  @Column({ select: false })
  unique: string;

  @Column({ select: false })
  password: string;

  @Column()
  passwordLastChangedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
