import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, Like, Repository } from 'typeorm'

import { Loan } from '../entities/loan.entity'
import { CreateLoanDto, UpdateLoanDto } from '../dtos/loans.dto'
import { CustomersService } from 'src/customers/services/customers.service'
import { EmployeesService } from 'src/employees/services/employees.service'
import { FilterLoansDto } from '../dtos/filter-loans.dto'
import { FilterPaginator } from 'src/lib/filter-paginator'
import { CreateInstallmentDto } from '../dtos/create-installment.dto'
import { InstallmentsService } from './installments.service'
import { PaymentPeriod } from '../entities/payment-period.entity'
import { LOAN_STATES } from '../shared/constants'
import { LoanState } from '../entities/loan-state.entity'

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan) private repository: Repository<Loan>,
    private customerService: CustomersService,
    private employeeService: EmployeesService,
    private readonly installmentService: InstallmentsService,
  ) {}

  async create(loanDto: CreateLoanDto) {
    const newLoan = this.repository.create(loanDto)
    const customer = await this.customerService.findOne(loanDto.customerId)
    const employee = await this.employeeService.findOne(loanDto.employeeId)
    const paymentPeriod = { id: loanDto.paymentPeriodId } as PaymentPeriod
    const loanState = { id: loanDto.loanStateId } as LoanState

    newLoan.customer = customer
    newLoan.employee = employee
    newLoan.paymentPeriod = paymentPeriod
    newLoan.loanState = loanState
    newLoan.debt = loanDto.amount

    if (!loanDto.paymentDay) loanDto.paymentDay = new Date().getDate()
    if (loanDto.loanStateId === LOAN_STATES.FINALIZED) {
      newLoan.debt = 0
      newLoan.installmentsPaid = 1
    }

    return this.repository.save(newLoan)
  }

  async findAll(params: FilterLoansDto) {
    const paginator = new FilterPaginator(this.repository, {
      itemsPerPage: 10,
      relations: ['customer', 'employee'],
    })
    const result = paginator.filter(params.filter, params.value).paginate(params.page).execute()
    return result
  }

  findOne(id: number, relations?: string[]) {
    return this.repository.findOne({
      where: { id },
      relations,
    })
  }

  update(id: number, updateLoanDto: UpdateLoanDto) {}

  async rawUpdate(id: number, updateLoanDto: UpdateLoanDto) {
    return await this.repository
      .createQueryBuilder()
      .update(Loan)
      .set(updateLoanDto)
      .where('id = :id', { id })
      .execute()
  }

  getPendingLoans() {
    const LOAN_IN_PROGRESS_STATE = 2
    return this.repository
      .createQueryBuilder('loans')
      .where('loan_state_id = :id', { id: LOAN_IN_PROGRESS_STATE })
      .getMany()
  }

  async createInstallment(loanId: number, installmentDto: CreateInstallmentDto) {
    const loan = await this.findOne(loanId)
    installmentDto.debt = loan.debt
    await this.installmentService.create(installmentDto)
    let loanData: UpdateLoanDto = {
      lastInterestPayment: new Date(),
      currentInterest: Number(loan.currentInterest) - installmentDto.interest,
      totalInterestPaid: Number(loan.totalInterestPaid) + installmentDto.interest,
      installmentsPaid: Number(loan.installmentsPaid) + 1,
    }

    if (installmentDto.capital && installmentDto.capital > 0) {
      loanData = { ...loanData, debt: loan.debt - installmentDto.capital }
    }

    return await this.rawUpdate(loanId, loanData)
  }
}
