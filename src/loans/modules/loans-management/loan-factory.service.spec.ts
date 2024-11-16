import { Test, TestingModule } from '@nestjs/testing'

import { LoanFactoryService } from './loan-factory.service'
import { CreateLoanDto } from '../../dtos/loans.dto'
import { Employee } from 'src/employees/entities/employee.entity'
import { Customer } from 'src/customers/entities/customer.entity'
import { LOAN_STATES } from '../../shared/constants'
import { Loan } from '../../entities/loan.entity'

describe('LoanFactoryService', () => {
  let service: LoanFactoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanFactoryService],
    }).compile()

    service = module.get<LoanFactoryService>(LoanFactoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return a new Loan object', () => {
    const customer = new Customer()
    customer.id = 1
    customer.name = 'John Doe'
    const employee = new Employee()
    employee.id = 1
    employee.name = 'Pedro J'
    const loanDto: CreateLoanDto = {
      amount: 1000,
      customerId: 1,
      employeeId: 1,
      paymentPeriodId: 2,
      loanStateId: LOAN_STATES.IN_PROGRESS,
      paymentDay: 15,
      interestRate: 0,
      debt: 0,
      installmentsNumber: 0,
      startAt: undefined,
      endAt: undefined,
    }

    const loan = service.createLoan(loanDto, customer, employee)

    expect(loan).toBeInstanceOf(Loan)
    expect(loan.customer).toEqual(customer)
    expect(loan.employee).toEqual(employee)
    expect(loan.paymentPeriod).toEqual({ id: loanDto.paymentPeriodId })
    expect(loan.loanState).toEqual({ id: loanDto.loanStateId })
    expect(loan.debt).toBe(loanDto.amount)
    expect(loan.installmentsPaid).toBeUndefined()
  })
})
