import { Test, TestingModule } from '@nestjs/testing';
import { LoanReportsService } from './loan-reports.service';

describe('LoanReportsService', () => {
  let service: LoanReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanReportsService],
    }).compile();

    service = module.get<LoanReportsService>(LoanReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
