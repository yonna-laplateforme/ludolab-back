import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';

@Module({
  imports: [PrismaModule], // ◄ On injecte Prisma ici pour qu'il s'allume au démarrage !
  controllers: [AppController],
  providers: [],
})
export class AppModule {}