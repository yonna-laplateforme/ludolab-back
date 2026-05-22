import { Module } from '@nestjs/common';
import { AiInteractionsController } from './ai_interactions.controller';
import { AiInteractionsService } from './ai_interactions.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiInteractionsController],
  providers: [AiInteractionsService]
})
export class AiInteractionsModule {}
