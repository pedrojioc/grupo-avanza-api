import { Test, TestingModule } from '@nestjs/testing'
import { LoanManagementService } from './loans-management.service'
import { Loan } from 'src/loans/entities/loan.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('LoansManagementService', () => {
  let service: LoanManagementService
  let repository: Repository<Loan>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanManagementService,
        { provide: getRepositoryToken(Loan), useClass: Repository },
      ],
    }).compile()

    service = module.get<LoanManagementService>(LoanManagementService)
    repository = module.get<Repository<Loan>>(getRepositoryToken(Loan))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
