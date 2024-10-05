import { Injectable } from '@nestjs/common'
import { Loan } from '../entities/loan.entity'
import { CreateLoanDto } from '../dtos/loans.dto'
import { Customer } from 'src/customers/entities/customer.entity'
import { Employee } from 'src/employees/entities/employee.entity'
import { PaymentPeriod } from '../entities/payment-period.entity'
import { LoanState } from '../entities/loan-state.entity'
import { LOAN_STATES } from '../shared/constants'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class LoanFactoryService {
  constructor(@InjectRepository(Loan) private repository: Repository<Loan>) {}
  createLoan(createLoanDto: CreateLoanDto, customer: Customer, employee: Employee): Loan {
    const loan = this.repository.create(createLoanDto)
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
}
