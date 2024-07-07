import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Loan } from '../entities/loan.entity'
import { CreateLoanDto, UpdateLoanDto } from '../dtos/loans.dto'
import { CustomersService } from 'src/customers/services/customers.service'
import { EmployeesService } from 'src/employees/services/employees.service'
import { FilterPaginator } from 'src/lib/filter-paginator'
import { CreateInstallmentDto } from '../dtos/create-installment.dto'
import { PaymentPeriod } from '../entities/payment-period.entity'
import { LOAN_STATES } from '../shared/constants'
import { LoanState } from '../entities/loan-state.entity'
import { FilterPaginatorDto } from 'src/lib/filter-paginator/dtos/filter-paginator.dto'
import { PayOffDto } from '../dtos/pay-off.dto'
import { Interest } from '../entities/interest.entity'

import { InterestState } from '../entities/interest-state.entity'
import { INSTALLMENT_STATES } from '../constants/installments'
import { INTEREST_STATE } from '../constants/interests'
import { FilterLoansDto } from '../dtos/filter-loans.dto'

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan) private repository: Repository<Loan>,
    @InjectRepository(Interest) private interestRepo: Repository<Interest>,
    private customerService: CustomersService,
    private employeeService: EmployeesService,
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
    const result = paginator
      .filter({ loanStateId: params.state })
      .search(params.searchBy, params.searchValue)
      .paginate(params.page)
      .execute()
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
    return this.repository
      .createQueryBuilder('loans')
      .where('loan_state_id = :id', { id: LOAN_STATES.IN_PROGRESS })
      .getMany()
  }

  async payOff(loanId: number, payOffDto: PayOffDto) {
    const loan = await this.findOne(loanId)
    let totalInterestToPay = Number(loan.currentInterest)
    if (payOffDto.amount && payOffDto.amount <= loan.currentInterest) {
      throw new BadRequestException('El monto del interest debe ser mayor')
    }

    const pendingState = { id: INTEREST_STATE.PENDING } as InterestState
    const interests = await this.interestRepo.find({
      where: { loanId: loan.id, state: pendingState },
    })
    if (interests.length === 0) throw new NotFoundException('Intereses no encontrados')

    if (payOffDto.amount) {
      totalInterestToPay = payOffDto.amount
      const additionalInterest = payOffDto.amount - Number(loan.currentInterest)
      const interest = interests[interests.length - 1]
      const newAmount = Number(interest.amount) + additionalInterest
      await this.interestRepo.update({ id: interest.id }, { amount: newAmount })
    }

    const installmentData: CreateInstallmentDto = {
      loanId,
      installmentStateId: INSTALLMENT_STATES.PAID,
      paymentMethodId: payOffDto.paymentMethodId,
      debt: loan.debt,
      capital: loan.debt,
      interest: totalInterestToPay,
      total: Number(loan.debt) + totalInterestToPay,
      interestIds: interests.map((i) => i.id),
    }
    // await this.createInstallment(loan, installmentData)

    return true
  }
}
