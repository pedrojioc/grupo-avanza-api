import { Injectable } from '@nestjs/common'
import { Loan } from '../../entities/loan.entity'
import { CreateLoanDto, UpdateLoanDto } from '../../dtos/loans.dto'
import { Customer } from 'src/customers/entities/customer.entity'
import { Employee } from 'src/employees/entities/employee.entity'
import { PaymentPeriod } from '../../entities/payment-period.entity'
import { LoanState } from '../../entities/loan-state.entity'
import { LOAN_STATES } from '../../shared/constants'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateInstallmentDto } from '../../dtos/update-installment.dto'
import { INSTALLMENT_STATES } from 'src/loans/constants/installments'

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

  valuesAfterPayment(
    loan: Loan,
    updateInstallmentDto: UpdateInstallmentDto,
    daysLate: number,
    commissionAmount: number,
  ) {
    const interestToPay = updateInstallmentDto.interestPaymentAmount

    const newCurrentInterest = Number(loan.currentInterest) - interestToPay
    const currentInterest = newCurrentInterest < 0 ? 0 : newCurrentInterest
    const totalInterestPaid = Number(loan.totalInterestPaid) + interestToPay
    const commissionsPaid = Number(loan.commissionsPaid) + commissionAmount

    const data: UpdateLoanDto = {
      currentInterest,
      totalInterestPaid,
      daysLate,
      commissionsPaid,
    }

    if (updateInstallmentDto.installmentStateId === INSTALLMENT_STATES.PAID) {
      data.installmentsPaid = Number(loan.installmentsPaid) + 1
    }

    if (updateInstallmentDto.capital > 0) {
      data.debt = Number(loan.debt) - updateInstallmentDto.capital
    }
    if (data.debt === 0) data.loanStateId = LOAN_STATES.FINALIZED
    return data
  }
}
