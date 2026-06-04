import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ExerciseModule } from './exercises/exercises.module';
import { AiInteractionsModule } from './ai_interactions/ai_interactions.module';
import { ProgressionService } from './progression/progression.service';
import { ProgressionController } from './progression/progression.controller';
import { ProgressionModule } from './progression/progression.module';
import { SubjectsModule } from './subjects/subjects.module';
import { SubscriptionsService } from './subscriptions/subscriptions.service';
import { SubscriptionsController } from './subscriptions/subscriptions.controller';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
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
    ProgressionController,
    SubscriptionsController,
    AuthController,
  ],
  providers: [
    ProgressionService,
    SubscriptionsService,
    AuthService,
    UsersService,
    JwtService,
  ],
})
export class AppModule {}
