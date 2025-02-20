import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Loan } from '../entities/loan.entity'
import { LoanManagementService } from '../modules/loans-management/loans-management.service'
import { LoanFactoryService } from '../modules/loans-management/loan-factory.service'

const mockLoanFactoryService = {}

describe('LoanManagementService', () => {
  let service: LoanManagementService
  let repository: Repository<Loan>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanManagementService,
        { provide: getRepositoryToken(Loan), useClass: Repository },
        { provide: LoanFactoryService, useValue: mockLoanFactoryService },
      ],
    }).compile()

    service = module.get<LoanManagementService>(LoanManagementService)
    repository = module.get<Repository<Loan>>(getRepositoryToken(Loan))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
