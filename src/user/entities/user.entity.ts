import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GoalEntity } from 'src/goals/entities/goal.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => GoalEntity, (goal) => goal.user)
  goals: GoalEntity[];
}
