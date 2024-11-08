import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import {
  addDay,
  addMonth,
  diffDays,
  format,
  isAfter,
  isEqual,
  monthDays,
  monthEnd,
  parse,
} from '@formkit/tempo'
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

  private generateDeadline(paymentPeriodId: number, today: Date) {
    if (paymentPeriodId === PAYMENT_PERIODS.FORTNIGHTLY) {
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
    paymentPeriodId: number,
    today: Date,
  ) {
    const deadline = this.removeTime(this.generateDeadline(paymentPeriodId, today))
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
      console.log('Loan ID: ', loan.id)
      const dailyInterest = this.getDailyInterest(loan.debt, loan.interestRate)
      const interest = await this.interestService.getCurrentInterest(loan.id, todayString)

      if (interest) {
        console.log('Has interest: ', interest.id)
        if (isEqual(interest.lastInterestGenerated, todayString)) continue

        const interestValues = this.generateUpdateInterestDto(interest, dailyInterest, today)
        if (format(interest.deadline, this.DATE_FORMAT) === todayString) {
          interestValues.interestStateId = INTEREST_STATE.AWAITING_PAYMENT
        }
        await this.interestService.rawUpdate(interest.id, interestValues)
      } else {
        console.log('Do not have interest')
        if (this.dayOfMonth(today) > this.DAYS_OF_INTEREST) {
          console.log('Day of month is greater than DAYS_OF_INTEREST')
          continue
        }
        const newInterest = this.createInterestData(
          loan,
          dailyInterest,
          loan.paymentPeriodId,
          today,
        )
        await this.interestService.rawCreate(newInterest)
      }
      // Update current interest on loans table
      const currentInterest = Number(loan.currentInterest) + dailyInterest
      await this.updateLoanInterest(loan.id, currentInterest)
    }
    return true
  }

  async getOverdueInterests(todayString: string) {
    return await this.repository
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
  }

  calculateDaysLate(currentDaysLate: number, deadline: Date, todayString: string) {
    currentDaysLate = Number(currentDaysLate)
    const deadlineString = format(deadline, this.DATE_FORMAT)
    const differenceInDays = diffDays(todayString, deadlineString)

    if (currentDaysLate > differenceInDays) return currentDaysLate
    return differenceInDays
  }

  async checkOverduePayments() {
    const todayString = format(new Date(), this.DATE_FORMAT)
    const interests = await this.getOverdueInterests(todayString)

    for (const interest of interests) {
      const loan = await this.loanManagementService.findOne(interest.loanId)
      const daysLate = this.calculateDaysLate(loan.daysLate, interest.deadline, todayString)
      if (interest.interestStateId === INTEREST_STATE.AWAITING_PAYMENT) {
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

  async insertUnsavedInterests() {
    const loans = await this.loanManagementService.getLoansByState(LOAN_STATES.IN_PROGRESS)
    const today = format(new Date(), this.DATE_FORMAT)
    for (const loan of loans) {
      const lastInterestGenerated = await this.repository
        .createQueryBuilder('interest')
        .where('loan_id = :loanId', { loanId: loan.id })
        .orderBy('deadline', 'DESC')
        .getOne()

      if (lastInterestGenerated) {
        // console.log('Interest found, ID: ', lastInterestGenerated.id)
        // console.log(lastInterestGenerated.startAt, lastInterestGenerated.deadline)

        const prevDeadline = lastInterestGenerated.deadline.toString()

        // if today > deadline
        if (isAfter(today, prevDeadline)) {
          // Generate
          console.log('Generate interest')
          let startFrom = addDay(lastInterestGenerated.deadline, 1)
          if (startFrom.getDate() === 31) {
            startFrom = addDay(startFrom, 1)
          }
          const deadline = this.removeTime(addMonth(startFrom, 1))
          const dailyInterest = this.getDailyInterest(loan.debt, loan.interestRate)
          const days = diffDays(today, startFrom)
          const newInterest: CreateInterestDto = {
            amount: dailyInterest * days,
            capital: loan.debt,
            startAt: startFrom,
            deadline,
            days,
            loanId: loan.id,
            interestStateId: INTEREST_STATE.IN_PROGRESS,
            lastInterestGenerated: new Date(),
          }
          await this.interestService.rawCreate(newInterest)
        } else {
          console.log('No generate', lastInterestGenerated.loanId)
        }
      } else {
        console.log('Interest not found')
      }
    }
    console.log('Task successful')
  }
}
