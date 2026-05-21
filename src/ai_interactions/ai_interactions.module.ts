import { Module } from '@nestjs/common';
import { AiInteractionsController } from './ai_interactions.controller';
import { AiInteractionsService } from './ai_interactions.service';

@Module({
  controllers: [AiInteractionsController],
  providers: [AiInteractionsService]
})
export class AiInteractionsModule {}
