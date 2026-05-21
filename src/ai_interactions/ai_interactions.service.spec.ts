import { Test, TestingModule } from '@nestjs/testing';
import { AiInteractionsService } from './ai_interactions.service';

describe('AiInteractionsService', () => {
  let service: AiInteractionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiInteractionsService],
    }).compile();

    service = module.get<AiInteractionsService>(AiInteractionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
