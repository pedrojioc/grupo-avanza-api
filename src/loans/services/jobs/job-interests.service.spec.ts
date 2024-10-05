import { Test, TestingModule } from '@nestjs/testing'
import { JobInterestsService } from './job-interests.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Interest } from 'src/loans/entities/interest.entity'
import { Repository } from 'typeorm'
import { LoanManagementService } from 'src/loans/modules/loans-management/loans-management.service'
import { InterestsService } from 'src/loans/modules/interests/interests.service'
import { mockLoan } from '../../../../test/mocks/loans'
import { mockInterest } from '../../../../test/mocks/interests'
import { CreateInterestDto } from 'src/loans/dtos/create-interest.dto'
import { INTEREST_STATE } from 'src/loans/constants/interests'

const mockInterestService = {
  rawCreate: jest.fn(),
  rawUpdate: jest.fn(),
  getCurrentInterest: jest.fn(),
}

const mockLoanManagementService = {
  rawUpdate: jest.fn(),
  getLoansByState: jest.fn(),
}

function date(t: Date) {
  // const t = new Date()

  return {
    setMonth: (month: number) => {
      t.setMonth(month)
      console.log(t)
      return date(t)
    },
    setDay: (day: number) => {
      console.log(day)
      console.log('Before set day', t)
      t.setDate(day)
      console.log('After set day', t)
      return date(t)
    },
    get: () => new Date(t.setUTCHours(0, 0, 0, 0)),
  }
}

describe('JobInterestsService', () => {
  let jobInterestService: JobInterestsService
  let interestService: InterestsService
  let loanManagementService: LoanManagementService

  const repositoryToken = getRepositoryToken(Interest)
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobInterestsService,
        { provide: repositoryToken, useClass: Repository },
        { provide: LoanManagementService, useValue: mockLoanManagementService },
        { provide: InterestsService, useValue: mockInterestService },
      ],
    }).compile()

    jobInterestService = module.get<JobInterestsService>(JobInterestsService)
    loanManagementService = module.get<LoanManagementService>(LoanManagementService)
    interestService = module.get<InterestsService>(InterestsService)
  })

  it('should be defined', () => {
    expect(jobInterestService).toBeDefined()
  })

  it('should generate the updated values ​​of the interest', () => {})

  it('should update amount of an existing Interest', async () => {
    jest.spyOn(loanManagementService, 'getLoansByState').mockResolvedValueOnce([mockLoan])
    jest.spyOn(interestService, 'getCurrentInterest').mockResolvedValueOnce(mockInterest)
    jest
      .spyOn(loanManagementService, 'rawUpdate')
      .mockResolvedValueOnce({ generatedMaps: [{}], raw: {} })

    const dailyInterest = jobInterestService.getDailyInterest(mockLoan.debt, 10)
    const newInterestAmount = mockInterest.amount + dailyInterest
    const interestData = {
      amount: newInterestAmount,
      days: mockInterest.days + 1,
      lastInterestGenerated: new Date(),
    }
    const result = await jobInterestService.runDailyInterest()

    expect(interestService.rawUpdate).toHaveBeenCalledWith(mockInterest.id, interestData)
    expect(loanManagementService.rawUpdate).toHaveBeenCalledWith(mockLoan.id, {
      currentInterest: mockLoan.currentInterest + dailyInterest,
    })
    expect(result).toBe(true)
  })

  it('should create a new interest period', async () => {
    jest.spyOn(loanManagementService, 'getLoansByState').mockResolvedValueOnce([mockLoan])
    jest.spyOn(interestService, 'getCurrentInterest').mockResolvedValueOnce(null)
    jest
      .spyOn(loanManagementService, 'rawUpdate')
      .mockResolvedValueOnce({ generatedMaps: [{}], raw: {} })

    const dailyInterest = jobInterestService.getDailyInterest(mockLoan.debt, 10)
    const today = new Date()

    const deadline = date(today)
      .setMonth(10)
      .setDay(today.getDate() - 1)
      .get()
    const interestData: CreateInterestDto = {
      amount: dailyInterest,
      capital: mockLoan.debt,
      startAt: new Date(),
      deadline,
      days: 1,
      loanId: mockLoan.id,
      interestStateId: INTEREST_STATE.IN_PROGRESS,
      lastInterestGenerated: new Date(),
    }

    const result = await jobInterestService.runDailyInterest()

    expect(interestService.rawCreate).toHaveBeenCalledWith(interestData)
    expect(loanManagementService.rawUpdate).toHaveBeenCalledWith(mockLoan.id, {
      currentInterest: mockLoan.currentInterest + dailyInterest,
    })
    expect(result).toBe(true)
  })
})
