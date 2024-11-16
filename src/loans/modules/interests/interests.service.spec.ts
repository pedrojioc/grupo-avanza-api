import { date } from '@formkit/tempo'
import { Test, TestingModule } from '@nestjs/testing'
import { InterestsService } from './interests.service'
import { Repository } from 'typeorm'
import { Interest } from 'src/loans/entities/interest.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { mockLoan } from '../../../../test/mocks/loans'
import { InterestState } from 'src/loans/entities/interest-state.entity'
import { INTEREST_STATE } from 'src/loans/constants/interests'

const interestState = new InterestState()
interestState.id = INTEREST_STATE.OVERDUE
const interestMock: Interest = {
  id: 1,
  loan: mockLoan,
  loanId: mockLoan.id,
  amount: 100000,
  capital: 1000000,
  startAt: date('2024-09-01'),
  deadline: date('2024-09-30'),
  days: 30,
  state: interestState,
  interestStateId: interestState.id,
  lastInterestGenerated: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('InterestsService', () => {
  let service: InterestsService
  let repository: Repository<Interest>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterestsService,
        { provide: getRepositoryToken(Interest), useClass: Repository },
      ],
    }).compile()

    service = module.get<InterestsService>(InterestsService)
    repository = module.get<Repository<Interest>>(getRepositoryToken(Interest))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  /*
  it('should calculate the days of delay of a loan', async () => {
    jest.spyOn(service, 'findOldestInterest').mockResolvedValueOnce(interestMock)

    const daysLate = await service.calculateDaysLate(mockLoan.id)
    expect(daysLate).toEqual(18)
  })
  */
})
