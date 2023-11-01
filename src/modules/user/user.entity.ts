import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAuthScope } from './user.constant';

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

  @Column({
    type: 'varchar',
    enum: UserAuthScope,
    array: true,
    default: [UserAuthScope.PROFILE],
  })
  scopes: UserAuthScope[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
