import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { GoalEntity } from './entities/goal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GoalEntity])],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
