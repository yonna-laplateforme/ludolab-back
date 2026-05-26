import { Module } from '@nestjs/common';
import { ExerciseController } from './exercises.controller';
import { ExerciseService } from './exercises.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AiInteractionsService } from '../ai_interactions/ai_interactions.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExerciseController],
  providers: [ExerciseService, AiInteractionsService]
})
export class ExerciseModule {}
