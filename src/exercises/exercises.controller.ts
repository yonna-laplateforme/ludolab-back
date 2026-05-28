import {Controller,Get,Post,Body,Param, Delete } from '@nestjs/common';
import { ExerciseService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { AiInteractionsService } from '../ai_interactions/ai_interactions.service';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService, private ai: AiInteractionsService) {}
  @Post()
  async create(
    @Body()
    body : {url_image: string}
  ) {
    const exerciseJson = await this.ai.generateExerciceDetails(body.url_image);
    const exercise = {
      user_id: 1,
      subject_id: 1,
      image_path: exerciseJson.image_path || body.url_image, 
      title: exerciseJson.title,
      level: exerciseJson.level,
      description: exerciseJson.description
     }
    
    return this.exerciseService.create(exercise);
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
