import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AiInteractionsService } from './ai_interactions.service';

@Controller('ai-interactions')
export class AiInteractionsController {
      constructor(private readonly AiInteractionsService: AiInteractionsService) {}
      @Post()
      create(
        @Body()
        createAiInteractionsDto: {
          user_id: number;
          exercise_id: number;
          user_question: string;
          ai_response: string;
          help_type: string;
        },
      ) {
        return this.AiInteractionsService.create(createAiInteractionsDto);
      }
    
      @Get()
      findAll() {
        return this.AiInteractionsService.findAll();
      }
    
      @Get(':id')
      findOne(@Param('id') id: string) {
        return this.AiInteractionsService.findOne(+id);
      }
    
      @Delete(':id')
      remove(@Param('id') id: string) {
        return this.AiInteractionsService.remove(+id);
      }
}
