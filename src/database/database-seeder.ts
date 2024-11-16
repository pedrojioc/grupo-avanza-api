import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Loan } from 'src/loans/entities/loan.entity'
import { Customer } from 'src/customers/entities/customer.entity'
import { Employee } from 'src/employees/entities/employee.entity'
import { CreateCustomerDto } from 'src/customers/dtos/create-customer.dto'
import { CreateLoanDto } from 'src/loans/dtos/loans.dto'
import { LOAN_STATES, PAYMENT_PERIODS } from 'src/loans/shared/constants'
import { CreateInterestDto } from 'src/loans/dtos/create-interest.dto'
import { INTEREST_STATE } from 'src/loans/constants/interests'
import { Interest } from 'src/loans/entities/interest.entity'
import { PaymentPeriod } from 'src/loans/entities/payment-period.entity'
import { CreateInstallmentDto } from 'src/loans/dtos/create-installment.dto'
import { Installment } from 'src/loans/entities/installment.entity'

@Injectable()
export class DatabaseSeeder {
  constructor(private dataSource: DataSource) {}

  async seedCustomer() {
    const customerData: CreateCustomerDto = {
      financialActivityId: 1,
      name: 'Test Customer',
      idNumber: '123456',
      address: 'Calle 12',
      phoneNumber: '34234232',
      birthdate: new Date('1995-05-03'),
    }
    return await this.dataSource.getRepository(Customer).insert(customerData)
  }

  async seedInterest(loanId: number, interestState: number) {
    const interestData: CreateInterestDto = {
      amount: 500_000,
      capital: 5_000_000,
      startAt: new Date('2024-08-16'),
      deadline: new Date('2024-08-15'),
      days: 30,
      loanId: loanId,
      interestStateId: interestState,
      lastInterestGenerated: null,
    }

    const interest = await this.dataSource.getRepository(Interest).insert(interestData)
    return interest
  }
  async seedLoans() {
    const loanData: CreateLoanDto = {
      customerId: 5,
      employeeId: 1,
      paymentPeriodId: PAYMENT_PERIODS.MONTHLY,
      amount: 5000000,
      debt: 5000000,
      interestRate: 10,
      installmentsNumber: 6,
      paymentDay: 16,
      lastInterestPayment: null,
      startAt: new Date('2024-08-16'),
      endAt: new Date('2025-02-16'),
      loanStateId: LOAN_STATES.IN_PROGRESS,
    }
    const repo = this.dataSource.getRepository(Loan)
    const loan = repo.create(loanData)
    loan.customer = { id: loanData.customerId } as Customer
    loan.employee = { id: loanData.employeeId } as Employee
    loan.paymentPeriod = { id: loanData.paymentPeriodId } as PaymentPeriod

    return await repo.save(loan)
  }

  async seedInstallment(loanId: number, installmentStateId: number) {
    const today = new Date()
    const startsOn = today.setMonth(today.getMonth() - 1)
    const installmentData: CreateInstallmentDto = {
      loanId,
      installmentStateId,
      debt: 2_000_000,
      startsOn: new Date(startsOn),
      paymentDeadline: today,
      days: 30,
      capital: 0,
      interest: 200_000,
      total: 0,
    }

    const interest = await this.dataSource.getRepository(Installment).insert(installmentData)
    return interest
  }
}
