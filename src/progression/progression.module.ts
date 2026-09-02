import { Module } from '@nestjs/common';
import { ProgressionController } from './progression.controller';
import { ProgressionService } from './progression.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AiInteractionsModule } from 'src/ai_interactions/ai_interactions.module';

@Module({
  imports: [PrismaModule, AiInteractionsModule],
  controllers: [ProgressionController],
  providers: [ProgressionService],
  exports: [ProgressionService],
})
export class ProgressionModule {}
