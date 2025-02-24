import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Loan } from '../entities/loan.entity'
import { CreateLoanDto, UpdateLoanDto } from '../dtos/loans.dto'
import { CustomersService } from 'src/customers/services/customers.service'
import { EmployeesService } from 'src/employees/services/employees.service'
import { LOAN_STATES, LoanStateValueTypes } from '../shared/constants'
import { PayOffDto } from '../dtos/pay-off.dto'

import { FilterLoansDto } from '../dtos/filter-loans.dto'
import { LoanFactoryService } from '../modules/loans-management/loan-factory.service'
import { PaymentsService } from '../modules/payments/payments.service'
import { AddPaymentDto } from '../modules/payments/dtos/add-payment.dto'
import { PaymentPeriod } from '../entities/payment-period.entity'
import { LoanState } from '../entities/loan-state.entity'
import { ROLE } from 'src/roles/constants/role-ids'

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan) private repository: Repository<Loan>,
    private customerService: CustomersService,
    private employeeService: EmployeesService,
    private paymentService: PaymentsService,
    private loanFactory: LoanFactoryService,
  ) {}

  async findOrReturnLoan(loanOrId: Loan | number): Promise<Loan> {
    let loan: Loan

    if (typeof loanOrId === 'number') {
      loan = await this.findOne(loanOrId, ['employee'])
    } else {
      loan = loanOrId
    }

    return loan
  }

  async create(loanDto: CreateLoanDto) {
    const customer = await this.customerService.findOne(loanDto.customerId)
    const employee = await this.employeeService.findOne(loanDto.employeeId)
    const loan = this.loanFactory.createLoan(loanDto, customer, employee)
    loan.paymentPeriod = { id: loanDto.paymentPeriodId } as PaymentPeriod
    loan.loanState = { id: loanDto.loanStateId } as LoanState

    return this.repository.save(loan)
  }

  async findAll(params: FilterLoansDto, roleId: number, userId: number) {
    const { employeeId } = params

    // ? Query base
    const loans = this.repository
      .createQueryBuilder('loans')
      .leftJoinAndSelect('loans.customer', 'customer')

    // ? Filter by employee
    if (roleId === ROLE.CEO) {
      if (employeeId) {
        loans.innerJoinAndSelect('loans.employee', 'employee', 'employee.id = :employeeId', {
          employeeId,
        })
      } else {
        loans.leftJoinAndSelect('loans.employee', 'employee')
      }
    } else {
      loans.innerJoinAndSelect('loans.employee', 'employee', 'employee.id = :employeeId', {
        employeeId: userId,
      })
    }

    if (params.installmentState) {
      loans
        .innerJoin('installments', 'i', 'loans.id = i.loan_id')
        .where('i.installment_state_id = :installmentStateId', {
          installmentStateId: params.installmentState,
        })
        .andWhere('loan_state_id = :loanState', { loanState: params.state })
    } else {
      loans.where('loan_state_id = :loanState', { loanState: params.state })
    }

    if (params.client) loans.andWhere('customer.name LIKE :client', { client: `${params.client}%` })

    loans
      .take(params.itemsPerPage)
      .skip(params.itemsPerPage * (params.page - 1))
      .orderBy('loans.id', 'DESC')

    const [data, counter] = await loans.getManyAndCount()
    return {
      data,
      total: counter,
      currentPage: params.page,
      itemsPerPage: params.itemsPerPage,
    }
  }

  findOne(id: number, relations?: string[]) {
    return this.repository.findOne({
      where: { id },
      relations,
    })
  }

  payOff(loanId: number, paymentDto: AddPaymentDto) {
    return this.paymentService.payOff(loanId, paymentDto)
  }
}
