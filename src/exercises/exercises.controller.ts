import {Controller,Get,Post,Body,Param, Delete } from '@nestjs/common';
import { ExerciseService } from './exercises.service';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}
  @Post()
  create(
    @Body()
    createExerciseDto: {
      user_id: number;
      subject_id: number;
      image_path: string;
      title: string;
      level: string;
    },
  ) {
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
