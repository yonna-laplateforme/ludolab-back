import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ExerciseModule } from './exercise/exercise.module';
import { AiInteractionsModule } from './ai_interactions/ai_interactions.module';
import { ProgressionService } from './progression/progression.service';
import { ProgressionController } from './progression/progression.controller';
import { ProgressionModule } from './progression/progression.module';
import { SubjectsModule } from './subjects/subjects.module';
import { SubscriptionsService } from './subscriptions/subscriptions.service';
import { SubscriptionsController } from './subscriptions/subscriptions.controller';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [PrismaModule, UsersModule, ExerciseModule, AiInteractionsModule, ProgressionModule, SubjectsModule, SubscriptionsModule], // ◄ On injecte Prisma ici pour qu'il s'allume au démarrage !
  controllers: [AppController, ProgressionController, SubscriptionsController],
  providers: [ProgressionService, SubscriptionsService],
})
export class AppModule {}