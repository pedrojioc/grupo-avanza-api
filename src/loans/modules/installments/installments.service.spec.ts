import { Test, TestingModule } from '@nestjs/testing'
import { InstallmentsService } from './installments.service'
import { MockType, dataSourceMockFactory } from '../../../../test/mocks/data-source.mock'
import { DataSource, Repository } from 'typeorm'
import { Installment } from 'src/loans/entities/installment.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { LoansService } from 'src/loans/services/loans.service'
import { InstallmentRepository } from 'src/loans/repositories/installment.repository'
import { LoanManagementService } from '../loans-management/loans-management.service'

describe('InstallmentsService', () => {
  let service: InstallmentsService
  let dataSource: MockType<DataSource>
  let repository: InstallmentRepository
  let loanService: LoanManagementService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstallmentsService,
        { provide: DataSource, useFactory: dataSourceMockFactory },
        { provide: getRepositoryToken(InstallmentRepository), useClass: Repository },
        { provide: LoanManagementService, useValue: { findOne: jest.fn() } },
      ],
    }).compile()

    service = module.get<InstallmentsService>(InstallmentsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
