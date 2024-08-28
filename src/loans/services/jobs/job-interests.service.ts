import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { addDay, addMonth, diffDays, format, isEqual } from '@formkit/tempo'
import { INTEREST_STATE } from '../../constants/interests'
import { Interest } from '../../entities/interest.entity'
import { LoansService } from '../loans.service'
import { InterestsService } from '../interests.service'
import { CreateInterestDto } from '../../dtos/create-interest.dto'
import { UpdateInterestDto } from 'src/loans/dtos/update-interest.dto'
import { LOAN_STATES } from 'src/loans/shared/constants'
import { InterestState } from 'src/loans/entities/interest-state.entity'

@Injectable()
export class JobInterestsService {
  private DAYS_OF_INTEREST = 30
  constructor(
    @InjectRepository(Interest) private repository: Repository<Interest>,
    private loanService: LoansService,
    private interestService: InterestsService,
  ) {}

  getDailyInterest(debt: number, interestRate: number) {
    const MONTH_DAYS = 30
    const interest = (debt * interestRate) / 100
    return interest / MONTH_DAYS
  }

  async runDailyInterest() {
    const DATE_FORMAT = 'YYYY-MM-DD'
    const today = new Date()
    const todayString = format(today, DATE_FORMAT)

    const loans = await this.loanService.getLoansByState(LOAN_STATES.IN_PROGRESS)

    for (const loan of loans) {
      const dailyInterest = this.getDailyInterest(loan.debt, loan.interestRate)

      const interest = await this.repository
        .createQueryBuilder('interest')
        .where(
          'loan_id = :loanId AND interest_state_id = :interestStateId AND deadline >= :currentDate',
          {
            loanId: loan.id,
            interestStateId: INTEREST_STATE.IN_PROGRESS,
            currentDate: todayString,
          },
        )
        .getOne()

      if (interest) {
        if (isEqual(interest.lastInterestGenerated, todayString)) continue

        let amount = Number(interest.amount)
        if (interest.days <= this.DAYS_OF_INTEREST) amount + dailyInterest

        const days = interest.days + 1

        const interestValues: UpdateInterestDto = {
          amount,
          days,
          lastInterestGenerated: today,
        }

        if (format(interest.deadline, DATE_FORMAT) === todayString) {
          interestValues.interestStateId = INTEREST_STATE.AWAITING_PAYMENT
        }
        await this.interestService.rawUpdate(interest.id, interestValues)
      } else {
        const nextMonth = addMonth(addDay(today, -1), 1)
        const newInterest: CreateInterestDto = {
          amount: dailyInterest,
          capital: loan.debt,
          startAt: today,
          deadline: nextMonth,
          days: 1,
          loanId: loan.id,
          interestStateId: 1,
          lastInterestGenerated: today,
        }
        await this.interestService.rawCreate(newInterest)
      }
      // Update current interest on loans table
      const currentInterest = Number(loan.currentInterest) + dailyInterest
      await this.loanService.rawUpdate(loan.id, {
        currentInterest,
      })
    }
    return true
  }

  async checkOverduePayments() {
    const DATE_FORMAT = 'YYYY-MM-DD'
    const today = new Date()
    const todayString = format(today, DATE_FORMAT)

    const interests = await this.repository
      .createQueryBuilder('interest')
      .where(
        '(interest_state_id = :interestStateAwaiting OR interest_state_id = :interestStateOverdue) AND deadline < :currentDate',
        {
          interestStateAwaiting: INTEREST_STATE.AWAITING_PAYMENT,
          interestStateOverdue: INTEREST_STATE.OVERDUE,
          currentDate: todayString,
        },
      )
      .getMany()

    for (const interest of interests) {
      const loan = await this.loanService.findOne(interest.loanId)
      const days = diffDays(todayString, format(interest.deadline, DATE_FORMAT))
      const daysLate = Number(loan.daysLate) > days ? Number(loan.daysLate) + days : days
      console.log(days, loan.daysLate)

      if (interest.state === ({ id: INTEREST_STATE.AWAITING_PAYMENT } as InterestState)) {
        await this.interestService.rawUpdate(interest.id, {
          interestStateId: INTEREST_STATE.OVERDUE,
        })
      }
      await this.loanService.rawUpdate(interest.loanId, { daysLate })
    }

    return true
  }

  async updateState() {
    const DATE_FORMAT = 'YYYY-MM-DD'
    const today = new Date()
    const todayString = format(today, DATE_FORMAT)

    const interests = await this.repository
      .createQueryBuilder('interests')
      .where('interest_state_id = :interestState AND deadline <= :currentDate', {
        interestState: INTEREST_STATE.IN_PROGRESS,
        currentDate: todayString,
      })
      .getMany()

    for (const interest of interests) {
      const daysLate = diffDays(todayString, format(interest.deadline, DATE_FORMAT))
      if (daysLate > 0) {
        await this.interestService.rawUpdate(interest.id, {
          interestStateId: INTEREST_STATE.OVERDUE,
        })
        await this.loanService.rawUpdate(interest.loanId, { daysLate })
      } else {
        await this.interestService.rawUpdate(interest.id, {
          interestStateId: INTEREST_STATE.AWAITING_PAYMENT,
        })
      }
    }
    console.log('Operación completada')
  }
}
