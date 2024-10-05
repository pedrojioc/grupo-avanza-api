import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { addDay, addMonth, diffDays, format, isEqual, monthDays, monthEnd } from '@formkit/tempo'
import { INTEREST_STATE } from '../../constants/interests'
import { Interest } from '../../entities/interest.entity'
import { CreateInterestDto } from '../../dtos/create-interest.dto'
import { UpdateInterestDto } from 'src/loans/dtos/update-interest.dto'
import { LOAN_STATES, PAYMENT_PERIODS } from 'src/loans/shared/constants'
import { InterestState } from 'src/loans/entities/interest-state.entity'
import { PaymentPeriod } from 'src/loans/entities/payment-period.entity'
import { LoanManagementService } from 'src/loans/modules/loans-management/loans-management.service'
import { InterestsService } from 'src/loans/modules/interests/interests.service'
import { Loan } from 'src/loans/entities/loan.entity'

@Injectable()
export class JobInterestsService {
  private DAYS_OF_INTEREST = 30
  private DATE_FORMAT = 'YYYY-MM-DD'
  constructor(
    @InjectRepository(Interest) private repository: Repository<Interest>,
    private loanManagementService: LoanManagementService,
    private interestService: InterestsService,
  ) {}

  getDailyInterest(debt: number, interestRate: number) {
    const MONTH_DAYS = 30
    const interest = (debt * interestRate) / 100
    return interest / MONTH_DAYS
  }

  private generateUpdateInterestDto(interest: Interest, dailyInterest: number, today: Date) {
    let amount = Number(interest.amount)
    if (interest.days <= this.DAYS_OF_INTEREST) amount = amount + dailyInterest

    const days = interest.days + 1

    const interestValues: UpdateInterestDto = {
      amount,
      days,
      lastInterestGenerated: today,
    }

    return interestValues
  }

  private dayOfMonth(date: Date) {
    return date.getDate()
  }

  private getFortnightlyDeadline(today: Date) {
    const dayOfTheMonth = this.dayOfMonth(today)
    if (dayOfTheMonth < 15) {
      return new Date(new Date().setDate(15))
    }
    let deadline = monthEnd(today)
    if (monthDays(deadline) === 31) {
      deadline = addDay(deadline, -1)
    }
    return deadline
  }

  private generateDeadline(paymentPeriod: PaymentPeriod, today: Date) {
    if (paymentPeriod.id === PAYMENT_PERIODS.FORTNIGHTLY) {
      return this.getFortnightlyDeadline(today)
    }
    return addMonth(addDay(today, -1), 1)
  }

  private removeTime(date: Date) {
    return new Date(date.setUTCHours(0, 0, 0, 0))
  }

  private createInterestData(
    loan: Loan,
    dailyInterest: number,
    paymentPeriod: PaymentPeriod,
    today: Date,
  ) {
    const deadline = this.removeTime(this.generateDeadline(paymentPeriod, today))
    const newInterest: CreateInterestDto = {
      amount: dailyInterest,
      capital: loan.debt,
      startAt: today,
      deadline,
      days: 1,
      loanId: loan.id,
      interestStateId: INTEREST_STATE.IN_PROGRESS,
      lastInterestGenerated: today,
    }

    return newInterest
  }

  private async updateLoanInterest(loanId: number, interestAmount: number) {
    return await this.loanManagementService.rawUpdate(loanId, {
      currentInterest: interestAmount,
    })
  }

  async runDailyInterest(today = new Date()) {
    const todayString = format(today, this.DATE_FORMAT)
    const loans = await this.loanManagementService.getLoansByState(LOAN_STATES.IN_PROGRESS)

    for (const loan of loans) {
      const dailyInterest = this.getDailyInterest(loan.debt, loan.interestRate)
      const interest = await this.interestService.getCurrentInterest(loan.id, todayString)

      if (interest) {
        if (isEqual(interest.lastInterestGenerated, todayString)) continue

        const interestValues = this.generateUpdateInterestDto(interest, dailyInterest, today)
        if (format(interest.deadline, this.DATE_FORMAT) === todayString) {
          interestValues.interestStateId = INTEREST_STATE.AWAITING_PAYMENT
        }
        await this.interestService.rawUpdate(interest.id, interestValues)
      } else {
        if (this.dayOfMonth(today) > this.DAYS_OF_INTEREST) {
          continue
        }
        const newInterest = this.createInterestData(loan, dailyInterest, loan.paymentPeriod, today)
        await this.interestService.rawCreate(newInterest)
      }
      // Update current interest on loans table
      const currentInterest = Number(loan.currentInterest) + dailyInterest
      await this.updateLoanInterest(loan.id, currentInterest)
    }
    return true
  }

  async checkOverduePayments() {
    const today = new Date()
    const todayString = format(today, this.DATE_FORMAT)

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
      const loan = await this.loanManagementService.findOne(interest.loanId)
      const days = diffDays(todayString, format(interest.deadline, this.DATE_FORMAT))
      const daysLate = Number(loan.daysLate) > days ? Number(loan.daysLate) + days : days
      console.log(days, loan.daysLate)

      if (interest.state === ({ id: INTEREST_STATE.AWAITING_PAYMENT } as InterestState)) {
        await this.interestService.rawUpdate(interest.id, {
          interestStateId: INTEREST_STATE.OVERDUE,
        })
      }
      await this.loanManagementService.rawUpdate(interest.loanId, { daysLate })
    }

    return true
  }

  async updateState() {
    const today = new Date()
    const todayString = format(today, this.DATE_FORMAT)

    const interests = await this.repository
      .createQueryBuilder('interests')
      .where('interest_state_id = :interestState AND deadline <= :currentDate', {
        interestState: INTEREST_STATE.IN_PROGRESS,
        currentDate: todayString,
      })
      .getMany()

    for (const interest of interests) {
      const daysLate = diffDays(todayString, format(interest.deadline, this.DATE_FORMAT))
      if (daysLate > 0) {
        await this.interestService.rawUpdate(interest.id, {
          interestStateId: INTEREST_STATE.OVERDUE,
        })
        await this.loanManagementService.rawUpdate(interest.loanId, { daysLate })
      } else {
        await this.interestService.rawUpdate(interest.id, {
          interestStateId: INTEREST_STATE.AWAITING_PAYMENT,
        })
      }
    }
    console.log('Operación completada')
  }
}
