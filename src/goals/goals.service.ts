import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoalEntity } from './entities/goal.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(GoalEntity)
    private readonly goalsRepo: Repository<GoalEntity>,
  ) {}

  async create(dto: CreateGoalDto, userId: number) {
    const goal = this.goalsRepo.create({
      ...dto,
      owner: { id: userId } as UserEntity,
    });
    return await this.goalsRepo.save(goal);
  }

  async findAll(userId: number) {
    return await this.goalsRepo.find({
      where: { owner: { id: userId } },
      relations: ['owner'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} goal`;
  }

  update(id: number, updateGoalDto: UpdateGoalDto) {
    return `This action updates a #${id} goal`;
  }

  remove(id: number) {
    return `This action removes a #${id} goal`;
  }
}
