import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateGoalDto, @Request() req) {
    return this.goalsService.create(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.goalsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGoalDto, @Request() req) {
    return this.goalsService.update(+id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalsService.remove(+id);
  }
}
