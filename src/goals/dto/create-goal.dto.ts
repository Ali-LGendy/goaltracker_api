import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsInt()
  parentId?: any;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsString()
  publicId?: string;
}
