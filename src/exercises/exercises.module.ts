import { Module } from '@nestjs/common';
import { ExerciseController } from './exercises.controller';
import { ExerciseService } from './exercises.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AiInteractionsModule } from '../ai_interactions/ai_interactions.module';
import { SubjectsModule } from '../subjects/subjects.module';
import { ProgressionModule } from '../progression/progression.module';

@Module({
  imports: [
    PrismaModule,
    AiInteractionsModule,
    SubjectsModule,
    ProgressionModule,
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService],
  exports: [ExerciseService],
})
export class ExerciseModule {}
