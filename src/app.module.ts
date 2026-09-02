import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ExerciseModule } from './exercises/exercises.module';
import { AiInteractionsModule } from './ai_interactions/ai_interactions.module';
import { ProgressionModule } from './progression/progression.module';
import { SubjectsModule } from './subjects/subjects.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // <-- C'est cette ligne magique qui règle tout !
    }),
    PrismaModule,
    UsersModule,
    ExerciseModule,
    AiInteractionsModule,
    ProgressionModule,
    SubjectsModule,
    SubscriptionsModule,
    AuthModule,
  ], // ◄ On injecte Prisma ici pour qu'il s'allume au démarrage !
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
