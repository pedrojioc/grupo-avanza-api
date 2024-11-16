import { Test, TestingModule } from '@nestjs/testing'
import { InstallmentsService } from './installments.service'
import { MockType, dataSourceMockFactory } from '../../../../test/mocks/data-source.mock'
import { DataSource, Repository } from 'typeorm'
import { Installment } from 'src/loans/entities/installment.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { LoanManagementService } from '../loans-management/loans-management.service'
import { LoanFactoryService } from '../loans-management/loan-factory.service'

describe('InstallmentsService', () => {
  let service: InstallmentsService
  let dataSource: MockType<DataSource>
  let repository: Repository<Installment>
  let loanService: LoanManagementService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstallmentsService,
        { provide: getRepositoryToken(Installment), useClass: Repository },
        { provide: DataSource, useFactory: dataSourceMockFactory },
        { provide: LoanFactoryService, useValue: { findOne: jest.fn() } },
      ],
    }).compile()

    service = module.get<InstallmentsService>(InstallmentsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
