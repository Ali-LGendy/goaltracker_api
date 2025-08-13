import { IsArray, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GoalOrderDto {
  @IsInt()
  id: number;

  @IsInt()
  order: number;
}

export class ReorderGoalsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GoalOrderDto)
  goals: GoalOrderDto[];

  @IsOptional()
  @IsInt()
  parentId?: number | null;
}