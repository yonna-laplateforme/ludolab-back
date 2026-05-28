import {Controller,Get,Post,Body,Param, Delete } from '@nestjs/common';
import { ExerciseService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { AiInteractionsService } from '../ai_interactions/ai_interactions.service';
import { CreateExerciseRequestDto } from './dto/create-exercise-request.dto'

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService, private ai: AiInteractionsService) {}
  @Post()
  async create(
    @Body()
    body: CreateExerciseRequestDto
  ) {
    const exerciseJson = await this.ai.generateExerciceDetails(body.url_image);
    
    const createExerciseDto: CreateExerciseDto = {
      user_id: 1,
      subject_id: 1,
      image_path: exerciseJson.image_path || body.url_image, 
      title: exerciseJson.title,
      level: exerciseJson.level,
      description: exerciseJson.description
     }
    
    return this.exerciseService.create(createExerciseDto);
  }

  @Get()
  findAll() {
    return this.exerciseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciseService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseService.remove(+id);
  }
}
