import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('goals')
export class GoalEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamptz', nullable: true })
  deadline: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ type: 'uuid', nullable: true })
  parentId?: string | null;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ nullable: true })
  publicId?: string;

  @ManyToOne(() => UserEntity, (user) => user.goals, { onDelete: 'CASCADE' })
  owner: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
