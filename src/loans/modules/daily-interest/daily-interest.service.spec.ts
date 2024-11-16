import { Test, TestingModule } from '@nestjs/testing'
import { DailyInterestService } from './daily-interest.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DailyInterest } from 'src/loans/entities/daily-interest.entity'
import { Repository } from 'typeorm'

describe('DailyInterestService', () => {
  let service: DailyInterestService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyInterestService,
        { provide: getRepositoryToken(DailyInterest), useClass: Repository },
      ],
    }).compile()

    service = module.get<DailyInterestService>(DailyInterestService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
