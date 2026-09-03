import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ProgressionService } from './progression.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Progression')
@Controller('progression')
export class ProgressionController {
  constructor(private readonly progressionService: ProgressionService) {}

  @Post('validate-step')
  @ApiOperation({ summary: 'Valider une étape d\'un exercice par l\'IA' })
  @ApiResponse({ status: 200, description: 'Résultat de la validation et feedback de l\'IA' })
  async validateStep(
    @Body()
    body: {
      exercise_id: number;
      step_number: number;
      student_answer: string;
      user_id?: number;
    },
  ) {
    return this.progressionService.validateStep({
      exercise_id: Number(body.exercise_id),
      step_number: Number(body.step_number),
      student_answer: body.student_answer,
      user_id: body.user_id ? Number(body.user_id) : 1,
    });
  }

  @Get(':exerciseId')
  @ApiOperation({ summary: 'Récupérer la progression d\'un exercice' })
  async getProgression(
    @Param('exerciseId') exerciseId: string,
    @Query('user_id') userId?: string,
  ) {
    return this.progressionService.getOrCreateProgression(
      Number(exerciseId),
      userId ? Number(userId) : 1,
    );
  }
}
