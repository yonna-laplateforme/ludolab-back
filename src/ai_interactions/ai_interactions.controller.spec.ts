import { Test, TestingModule } from '@nestjs/testing';
import { AiInteractionsController } from './ai_interactions.controller';

describe('AiInteractionsController', () => {
  let controller: AiInteractionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiInteractionsController],
    }).compile();

    controller = module.get<AiInteractionsController>(AiInteractionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
