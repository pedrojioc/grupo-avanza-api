import { Test, TestingModule } from '@nestjs/testing';
import { ManualTasksService } from './manual-tasks.service';

describe('ManualTasksService', () => {
  let service: ManualTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManualTasksService],
    }).compile();

    service = module.get<ManualTasksService>(ManualTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
