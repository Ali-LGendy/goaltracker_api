import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { GoalEntity } from './entities/goal.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(GoalEntity)
    private readonly goalsRepo: Repository<GoalEntity>,
  ) {}

  async create(dto: CreateGoalDto, userId: number) {
    let parent: GoalEntity | null = null;

    if (dto.parentId) {
      parent = await this.goalsRepo.findOne({
        where: { id: +dto.parentId, owner: { id: userId } },
        relations: ['parent'],
      });

      if (!parent) throw new Error('Parent goal not found');

      if (parent.parent && parent.parent.parent) {
        throw new Error('Cannot add child to a grandchild goal');
      }
    }

    const goal = this.goalsRepo.create({
      ...dto,
      owner: { id: userId } as UserEntity,
      parent: parent || null,
    });

    return await this.goalsRepo.save(goal);
  }

  async findAll(userId: number) {
    return await this.goalsRepo.find({
      where: { owner: { id: userId }, parent: IsNull() },
      relations: ['children', 'children.children'],
      order: {
        order: 'ASC',
        children: { order: 'ASC' },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} goal`;
  }

  async update(id: number, dto: UpdateGoalDto, userId: number) {
    const goal = await this.goalsRepo.findOne({
      where: { id, owner: { id: userId } },
      relations: ['parent', 'parent.parent'],
    });

    if (!goal) {
      throw new Error('Goal not found');
    }

    if (dto.parentId !== undefined) {
      let newParent: GoalEntity | null = null;

      if (dto.parentId) {
        newParent = await this.goalsRepo.findOne({
          where: { id: +dto.parentId, owner: { id: userId } },
          relations: ['parent', 'parent.parent'],
        });

        if (!newParent) throw new Error('New parent goal not found');

        if (newParent.parent && newParent.parent.parent) {
          throw new Error('Cannot set a grandchild as parent');
        }
      }

      goal.parent = newParent;
    }

    Object.assign(goal, dto);

    return await this.goalsRepo.save(goal);
  }

  async remove(id: number, userId: number) {
    const goal = await this.goalsRepo.findOne({
      where: { id, owner: { id: userId } },
    });

    if (!goal) {
      throw new Error('Goal not found');
    }

    await this.goalsRepo.remove(goal);

    return { message: 'Goal deleted successfully' };
  }
}
