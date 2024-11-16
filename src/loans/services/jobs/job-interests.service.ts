import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import {
  addDay,
  addMonth,
  diffDays,
  format,
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
import { Loan } from 'src/loans/entities/loan.entity'
import { InstallmentsService } from 'src/loans/modules/installments/installments.service'
import { DailyInterestService } from 'src/loans/modules/daily-interest/daily-interest.service'
import { Installment } from 'src/loans/entities/installment.entity'
import { UpdateInstallmentDto } from 'src/loans/dtos/update-installment.dto'
import { INSTALLMENT_STATES } from 'src/loans/constants/installments'
import { CreateInstallmentDto } from 'src/loans/dtos/create-installment.dto'

@Injectable()
export class JobInterestsService {
  private DAYS_OF_INTEREST = 30
  private DATE_FORMAT = 'YYYY-MM-DD'
  private TODAY = parse(new Date().toISOString(), this.DATE_FORMAT)
  constructor(
    @InjectRepository(Interest) private repository: Repository<Interest>,
    private installmentService: InstallmentsService,
    private dailyInterestService: DailyInterestService,
    private loanManagementService: LoanManagementService,
  ) {}

  getDailyInterest(debt: number, interestRate: number) {
    const MONTH_DAYS = 30
    const interest = (debt * interestRate) / 100
    return interest / MONTH_DAYS
  }

  private generateUpdateInterestDto(installment: Installment, dailyInterest: number) {
    let interest = Number(installment.interest)
    if (installment.days <= this.DAYS_OF_INTEREST) interest = interest + dailyInterest

    const days = installment.days + 1

    const installmentDto: UpdateInstallmentDto = {
      interest,
      days,
    }

    return installmentDto
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

  private createInstallmentData(
    loan: Loan,
    dailyInterest: number,
    paymentPeriod: PaymentPeriod,
    today: Date,
  ) {
    const deadline = this.removeTime(this.generateDeadline(paymentPeriod, today))
    const installmentData: CreateInstallmentDto = {
      loanId: loan.id,
      installmentStateId: INSTALLMENT_STATES.IN_PROGRESS,
      debt: loan.debt,
      startsOn: this.TODAY,
      paymentDeadline: deadline,
      days: 1,
      capital: 0,
      interest: dailyInterest,
      total: 0,
    }

    return installmentData
  }

  private async updateLoanInterest(loanId: number, interestAmount: number) {
    return await this.loanManagementService.rawUpdate(loanId, {
      currentInterest: interestAmount,
    })
  }

  async runDailyInterest(today = this.TODAY) {
    const loans = await this.loanManagementService.getLoansByState(LOAN_STATES.IN_PROGRESS)

    for (const loan of loans) {
      const dailyInterestAmount = this.getDailyInterest(loan.debt, loan.interestRate)
      let installment = await this.installmentService.getCurrentInstallment(loan.id)

      if (installment) {
        const daily = await this.dailyInterestService.findOneByDate(today)
        if (daily) continue

        const installmentValues = this.generateUpdateInterestDto(installment, dailyInterestAmount)
        if (isEqual(installment.paymentDeadline, today)) {
          installmentValues.installmentStateId = INSTALLMENT_STATES.AWAITING_PAYMENT
        }
        await this.installmentService.update(installment.id, installmentValues)
      } else {
        if (this.dayOfMonth(today) > this.DAYS_OF_INTEREST) continue

        const newInstallment = this.createInstallmentData(
          loan,
          dailyInterestAmount,
          loan.paymentPeriod,
          today,
        )
        installment = await this.installmentService.create(newInstallment)
      }
      // Create daily interest history
      await this.dailyInterestService.create({
        installmentId: installment.id,
        amount: dailyInterestAmount,
        date: today,
      })
      // Update current interest on loans table
      const currentInterest = Number(loan.currentInterest) + dailyInterestAmount
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

  calculateDaysLate(currentDaysLate: number, deadline: Date, today: Date) {
    currentDaysLate = Number(currentDaysLate)
    const differenceInDays = diffDays(today, deadline)

    if (currentDaysLate > differenceInDays) return currentDaysLate
    return differenceInDays
  }

  async checkOverduePayments() {
    const today = this.TODAY

    const loans = await this.loanManagementService.getLoansByState(LOAN_STATES.IN_PROGRESS)
    for (const loan of loans) {
      const installments = await this.installmentService.findUnpaidInstallments(loan.id)

      for (const installment of installments) {
        const daysLate = this.calculateDaysLate(loan.daysLate, installment.paymentDeadline, today)
        if (installment.installmentStateId === INSTALLMENT_STATES.AWAITING_PAYMENT) {
          await this.installmentService.update(installment.id, {
            installmentStateId: INSTALLMENT_STATES.OVERDUE,
          })
        }
        await this.loanManagementService.rawUpdate(loan.id, { daysLate })
      }
    }

    return true
  }

  /*
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
  */
}
