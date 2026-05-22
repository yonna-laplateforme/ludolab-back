import { Module } from '@nestjs/common';
import { ExerciseController } from './exercises.controller';
import { ExerciseService } from './exercises.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExerciseController],
  providers: [ExerciseService]
})
export class ExerciseModule {}
