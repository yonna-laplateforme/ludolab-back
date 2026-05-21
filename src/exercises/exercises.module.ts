import { Module } from '@nestjs/common';
import { ExerciseController } from './exercises.controller';
import { ExerciseService } from './exercises.service';

@Module({
  controllers: [ExerciseController],
  providers: [ExerciseService]
})
export class ExerciseModule {}
