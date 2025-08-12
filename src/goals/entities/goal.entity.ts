import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('goals')
export class GoalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamptz', nullable: true })
  deadline: Date;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ type: 'uuid', nullable: true })
  parentId?: string | null;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ nullable: true })
  publicId?: string;

  @ManyToOne(() => GoalEntity, (goal) => goal.children, { onDelete: 'CASCADE', nullable: true })
  parent?: GoalEntity | null;

  @OneToMany(() => GoalEntity, (goal) => goal.parent)
  children: GoalEntity[];

  @ManyToOne(() => UserEntity, (user) => user.goals, { onDelete: 'CASCADE' })
  owner: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
