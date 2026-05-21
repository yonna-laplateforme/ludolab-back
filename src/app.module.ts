import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, UsersModule], // ◄ On injecte Prisma ici pour qu'il s'allume au démarrage !
  controllers: [AppController],
  providers: [],
})
export class AppModule {}