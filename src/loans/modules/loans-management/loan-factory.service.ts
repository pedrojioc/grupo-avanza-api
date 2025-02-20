import { Injectable } from '@nestjs/common'
import { Loan } from '../../entities/loan.entity'
import { CreateLoanDto, UpdateLoanDto } from '../../dtos/loans.dto'
import { Customer } from 'src/customers/entities/customer.entity'
import { Employee } from 'src/employees/entities/employee.entity'
import { PaymentPeriod } from '../../entities/payment-period.entity'
import { LoanState } from '../../entities/loan-state.entity'
import { LOAN_STATES } from '../../shared/constants'
import { INSTALLMENT_STATES } from 'src/loans/constants/installments'
import { Installment } from 'src/loans/entities/installment.entity'

@Injectable()
export class LoanFactoryService {
  constructor() {}
  createLoan(createLoanDto: CreateLoanDto, customer: Customer, employee: Employee): Loan {
    const loan = new Loan()

    Object.assign(loan, createLoanDto)

    loan.customer = customer
    loan.employee = employee

    loan.paymentPeriod = { id: createLoanDto.paymentPeriodId } as PaymentPeriod
    loan.loanState = { id: createLoanDto.loanStateId } as LoanState
    loan.debt = createLoanDto.amount

    if (!createLoanDto.paymentDay) createLoanDto.paymentDay = new Date().getDate()
    if (createLoanDto.loanStateId === LOAN_STATES.FINALIZED) {
      loan.debt = 0
      loan.installmentsPaid = 1
    }

    return loan
  }

  valuesAfterPayment(loan: Loan, installment: Installment, daysLate: number, commission: number) {
    const interestToPay = installment.interestPaid

    const newCurrentInterest = Number(loan.currentInterest) - interestToPay
    const currentInterest = newCurrentInterest < 0 ? 0 : newCurrentInterest
    const totalInterestPaid = Number(loan.totalInterestPaid) + interestToPay
    const commissionsPaid = Number(loan.commissionsPaid) + commission

    const data: UpdateLoanDto = {
      currentInterest,
      totalInterestPaid,
      daysLate,
      commissionsPaid,
    }

    if (installment.installmentStateId === INSTALLMENT_STATES.PAID) {
      data.installmentsPaid = Number(loan.installmentsPaid) + 1
    }
    if (installment.capital > 0) {
      data.debt = Number(loan.debt) - installment.capital
    }
    if (data.debt === 0) data.loanStateId = LOAN_STATES.FINALIZED
    return data
  }
}
