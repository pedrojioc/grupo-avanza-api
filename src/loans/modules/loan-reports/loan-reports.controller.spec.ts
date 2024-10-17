import { Test, TestingModule } from '@nestjs/testing';
import { LoanReportsController } from './loan-reports.controller';

describe('LoanReportsController', () => {
  let controller: LoanReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanReportsController],
    }).compile();

    controller = module.get<LoanReportsController>(LoanReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
