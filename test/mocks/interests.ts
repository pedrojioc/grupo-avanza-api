import { Interest } from 'src/loans/entities/interest.entity'
import { mockLoan } from './loans'
import { InterestState } from 'src/loans/entities/interest-state.entity'
import { INTEREST_STATE } from 'src/loans/constants/interests'

const mockInterestState = new InterestState()
mockInterestState.id = INTEREST_STATE.IN_PROGRESS

export const mockInterest: Interest = {
  id: 1,
  loan: mockLoan,
  loanId: mockLoan.id,
  amount: 100_000,
  capital: 2_000_000,
  startAt: new Date('2024-09-01'),
  deadline: new Date('2024-09-30'),
  days: 12,
  state: mockInterestState,
  interestStateId: mockInterestState.id,
  lastInterestGenerated: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}
