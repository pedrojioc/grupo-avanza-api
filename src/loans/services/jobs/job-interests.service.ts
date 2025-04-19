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
import { INSTALLMENT_TYPES, LOAN_STATES, PAYMENT_PERIODS } from 'src/loans/shared/constants'
import { LoanManagementService } from 'src/loans/modules/loans-management/loans-management.service'
import { Loan } from 'src/loans/entities/loan.entity'
import { InstallmentsService } from 'src/loans/modules/installments/installments.service'
import { DailyInterestService } from 'src/loans/modules/daily-interest/daily-interest.service'
import { Installment } from 'src/loans/entities/installment.entity'
import { UpdateInstallmentDto } from 'src/loans/dtos/update-installment.dto'
import { INSTALLMENT_STATES } from 'src/loans/constants/installments'
import { CreateInstallmentDto } from 'src/loans/dtos/create-installment.dto'
import { UpdateLoanDto } from 'src/loans/dtos/loans.dto'

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

  // -------------------------------
  // COMMON METHODS
  // -------------------------------
  getDailyInterest(debt: number, interestRate: number) {
    const MONTH_DAYS = 30
    const monthlyInterest = (debt * interestRate) / 100
    return monthlyInterest / MONTH_DAYS
  }

  calculateDaysLate(deadline: Date, today: Date) {
    return diffDays(today, deadline)
  }

  private generateInstallmentDates(
    loan: Loan,
    installmentNumber: number,
  ): { startsOn: Date; deadline: Date } {
    let startsOn: Date
    let deadline: Date

    if (installmentNumber === 1) {
      startsOn = addDay(loan.startAt, 1)
      deadline = addMonth(loan.startAt, 1)
    } else {
      // Usamos loan.currentInstallmentNumber ya que es equivalente a installmentNumber para la cuota en progreso
      startsOn = addMonth(loan.startAt, loan.currentInstallmentNumber)
      deadline = addMonth(startsOn, 1)
      // Ajustamos que la cuota inicie el día siguiente
      startsOn.setDate(startsOn.getDate() + 1)
    }

    return { startsOn, deadline }
  }

  private isTodayTheDeadline(deadline: Date): boolean {
    return isEqual(deadline, format(this.TODAY, this.DATE_FORMAT))
  }

  // -------------------------------
  // METHODS FOR FLEXIBLE CREDITS
  // -------------------------------

  private generateUpdateInterestDto(
    installment: Installment,
    dailyInterest: number,
  ): UpdateInstallmentDto {
    let interest = Number(installment.interest)

    const days = installment.days + 1
    if (installment.days < 15) {
      interest = interest + dailyInterest
    } else if (installment.days === 15) {
      interest = interest + dailyInterest * 16
    }

    return {
      interest,
      days,
    }
  }

  private generateFlexibleInstallmentData(loan: Loan, dailyInterest: number): CreateInstallmentDto {
    const { startsOn, deadline } = this.generateInstallmentDates(
      loan,
      loan.currentInstallmentNumber + 1,
    )
    return {
      loanId: loan.id,
      installmentStateId: INSTALLMENT_STATES.IN_PROGRESS,
      debt: loan.debt,
      startsOn,
      paymentDeadline: deadline,
      days: 1,
      capital: 0,
      interest: dailyInterest,
      interestPaid: 0,
      total: 0,
    }
  }

  private async processFlexibleLoans(loan: Loan, today: Date): Promise<void> {
    const dailyInterestAmount = this.getDailyInterest(loan.debt, loan.interestRate)
    let installment = await this.installmentService.getCurrentInstallment(loan.id, today)
    let loanValues: UpdateLoanDto = { currentInterest: loan.currentInterest + dailyInterestAmount }

    if (installment) {
      console.log(typeof installment.paymentDeadline)
      const daily = await this.dailyInterestService.findOneByDate(installment.id, today)
      if (daily) return

      const updatedValues = this.generateUpdateInterestDto(installment, dailyInterestAmount)

      if (this.isTodayTheDeadline(installment.paymentDeadline)) {
        updatedValues.installmentStateId = INSTALLMENT_STATES.AWAITING_PAYMENT
      }
      await this.installmentService.update(installment.id, updatedValues)
    } else {
      const newInstallment = this.generateFlexibleInstallmentData(loan, dailyInterestAmount)
      installment = await this.installmentService.create(newInstallment)
      loanValues.currentInstallmentNumber = loan.currentInstallmentNumber + 1
    }
    // Create daily interest history
    await this.dailyInterestService.create({
      installmentId: installment.id,
      debt: loan.debt,
      amount: dailyInterestAmount,
      date: today,
    })
    // Update current interest on loans table
    await this.loanManagementService.rawUpdate(loan.id, loanValues)
  }

  // -------------------------------
  // METHODS FOR FIXED CREDITS (PROGRESSIVE GENERATION)
  // -------------------------------

  /**
   * Generates the start date and payment deadline for a fixed installment.
   * @param loan The loan object containing the start date and other details.
   * @param installmentNumber El numero de la cuota a generar.
   * @returns An object containing the start date and payment deadline for the installment.
   */
  private generateFixedInstallmentData(
    loan: Loan,
    installmentNumber: number,
  ): CreateInstallmentDto {
    const { startsOn, deadline } = this.generateInstallmentDates(loan, installmentNumber)

    const interestRate = loan.interestRate / 100
    const installmentAmount =
      (loan.amount * interestRate) / (1 - Math.pow(1 + interestRate, -loan.installmentsNumber))
    const prevBalance =
      loan.amount * Math.pow(1 + interestRate, installmentNumber - 1) -
      installmentAmount * ((Math.pow(1 + interestRate, installmentNumber - 1) - 1) / interestRate)

    const interest = prevBalance * interestRate
    const amortization = installmentAmount - interest
    const total = interest + amortization
    return {
      loanId: loan.id,
      installmentStateId: INSTALLMENT_STATES.IN_PROGRESS,
      debt: loan.debt,
      startsOn,
      paymentDeadline: deadline,
      days: 1,
      capital: amortization,
      interest,
      interestPaid: 0,
      total,
    }
  }

  private async processFixedLoans(loan: Loan) {
    const currentInstallment = await this.installmentService.getCurrentInstallment(
      loan.id,
      this.TODAY,
    )
    if (currentInstallment) {
      const updatedValues: UpdateInstallmentDto = {
        days: currentInstallment.days + 1,
      }
      if (this.isTodayTheDeadline(currentInstallment.paymentDeadline)) {
        updatedValues.installmentStateId = INSTALLMENT_STATES.AWAITING_PAYMENT
      }
      await this.installmentService.update(currentInstallment.id, updatedValues)
      return true
    } else {
      if (loan.currentInstallmentNumber >= loan.installmentsNumber) return true
      // Generate next installment
      const installmentNumber = loan.currentInstallmentNumber + 1
      const installmentData = this.generateFixedInstallmentData(loan, installmentNumber)
      await this.installmentService.create(installmentData)
      await this.loanManagementService.rawUpdate(loan.id, {
        currentInstallmentNumber: installmentNumber,
        currentInterest: loan.currentInterest + installmentData.interest,
      })
    }
  }

  async runDailyInterest(today = this.TODAY) {
    const loans = await this.loanManagementService.getLoansByState(LOAN_STATES.IN_PROGRESS)

    for (const loan of loans) {
      if (loan.installmentTypeId === INSTALLMENT_TYPES.FIXED) {
        await this.processFixedLoans(loan)
      } else {
        await this.processFlexibleLoans(loan, today)
      }
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

  async checkOverduePayments() {
    const today = this.TODAY
    const overdueStates = {
      [INSTALLMENT_STATES.AWAITING_PAYMENT]: true,
      [INSTALLMENT_STATES.IN_PROGRESS]: true,
    }

    const loans = await this.loanManagementService.getLoansByState(LOAN_STATES.IN_PROGRESS)
    for (const loan of loans) {
      const installments = await this.installmentService.findUnpaidInstallments(loan.id)

      const overdueInstallmentIds = []
      const daysLateArray = []
      for (const installment of installments) {
        const { installmentStateId } = installment
        // Check and store if the installment state needs to be updated
        if (overdueStates[installmentStateId]) overdueInstallmentIds.push(installment.id)

        // Calcula y almacena los días en mora de cada cuota
        const days = this.calculateDaysLate(installment.paymentDeadline, today)
        daysLateArray.push(days)
      }
      const daysLate = Math.max(...daysLateArray)

      await this.loanManagementService.rawUpdate(loan.id, { daysLate })
      await this.installmentService.bulkUpdate(overdueInstallmentIds, {
        installmentStateId: INSTALLMENT_STATES.OVERDUE,
      })
    }

    return true
  }

  async setCurrentInstallmentNumber() {
    const loans = await this.loanManagementService.getLoansByState(LOAN_STATES.IN_PROGRESS)
    for (const loan of loans) {
      const installmentsNumber = await this.installmentService.countInstallments(loan.id)
      await this.loanManagementService.rawUpdate(loan.id, {
        currentInstallmentNumber: installmentsNumber,
      })
    }
  }

  async setPaymentDateForPaidInstallments() {
    const installments = await this.installmentService.findAll({
      installmentStateId: INSTALLMENT_STATES.PAID,
    })
    for (const installment of installments) {
      await this.installmentService.update(installment.id, {
        paymentDate: installment.updatedAt,
      })
    }
  }
}
