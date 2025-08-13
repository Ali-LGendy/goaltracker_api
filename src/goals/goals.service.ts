import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { GoalEntity } from './entities/goal.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { GoalOrderDto } from './dto/reorder-goals.dto';

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

    let publicId = dto.publicId;
    if (dto.isPublic && !publicId) {
      publicId = uuidv4();
    }

    const goal = this.goalsRepo.create({
      ...dto,
      publicId,
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

  async findOne(id: number, userId: number) {
    if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid goal ID');
    }

    const goal = await this.goalsRepo.findOne({
      where: { id, owner: { id: userId } },
      relations: ['children', 'children.children', 'parent', 'owner'],
    });

    if (!goal) {
      throw new Error('Goal not found');
    }

    return goal;
  }

  async findAllPublic() {
    return await this.goalsRepo.find({
      where: {
        isPublic: true,
        parent: IsNull(),
      },
      relations: ['children', 'children.children', 'owner'],
      order: {
        createdAt: 'DESC',
        children: { order: 'ASC' },
      },
      select: {
        owner: {
          id: true,
        },
      },
    });
  }

  async findPublicGoal(publicId: string) {
    const goal = await this.goalsRepo.findOne({
      where: {
        publicId,
        isPublic: true,
      },
      relations: ['children', 'children.children', 'parent', 'owner'],
      select: {
        owner: {
          id: true,
        },
      },
    });

    if (!goal) {
      throw new Error('Public goal not found');
    }

    return goal;
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

    if (dto.isPublic === true && !goal.publicId && !dto.publicId) {
      dto.publicId = uuidv4();
    }

    if (dto.isPublic === false) {
      dto.publicId = undefined;
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

  async fixExistingPublicGoals() {
    const publicGoalsWithoutPublicId = await this.goalsRepo.find({
      where: {
        isPublic: true,
        publicId: IsNull(),
      },
    });

    for (const goal of publicGoalsWithoutPublicId) {
      goal.publicId = uuidv4();
      await this.goalsRepo.save(goal);
    }

    return {
      message: `Fixed ${publicGoalsWithoutPublicId.length} public goals`,
      fixedGoals: publicGoalsWithoutPublicId.map(g => ({ id: g.id, title: g.title, publicId: g.publicId }))
    };
  }

  async reorderGoals(dto: any, userId: number) {
    const { goals, parentId } = dto;

    const goalIds = goals.map(g => g.id);

    const whereConditions = goalIds.map(id => ({
      id,
      owner: { id: userId },
      parent: parentId ? { id: parentId } : IsNull()
    }));

    const userGoals = await this.goalsRepo.find({
      where: whereConditions,
      relations: ['parent'],
    });

    if (userGoals.length !== goalIds.length) {
      throw new Error('Some goals not found, unauthorized, or not at the specified level');
    }

    const expectedParentId = parentId || null;
    for (const goal of userGoals) {
      const goalParentId = goal.parent?.id || null;
      if (goalParentId !== expectedParentId) {
        throw new Error(`Goal ${goal.id} is not at the specified level`);
      }
    }

    const queryRunner = this.goalsRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const goalUpdate of goals) {
        await queryRunner.manager.update(GoalEntity, goalUpdate.id, {
          order: goalUpdate.order
        });
      }

      await queryRunner.commitTransaction();
      return { 
        message: 'Goals reordered successfully',
        level: parentId ? `children of goal ${parentId}` : 'root level',
        reorderedCount: goals.length
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('Failed to reorder goals: ');
    } finally {
      await queryRunner.release();
    }
  }
}