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

  @Get('public-goals')
  findAllPublic() {
    return this.goalsService.findAllPublic();
  }

  @Get('public-goals/:publicId')
  findPublicGoal(@Param('publicId') publicId: string) {
    return this.goalsService.findPublicGoal(publicId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.goalsService.findOne(+id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGoalDto, @Request() req) {
    return this.goalsService.update(+id, dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.goalsService.remove(+id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('fix-public-goals')
  fixPublicGoals() {
    return this.goalsService.fixExistingPublicGoals();
  }
}