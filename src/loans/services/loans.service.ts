import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'

import { Loan } from '../entities/loan.entity'
import { CreateLoanDto, UpdateLoanDto } from '../dtos/loans.dto'
import { CustomersService } from 'src/customers/services/customers.service'
import { EmployeesService } from 'src/employees/services/employees.service'
import { CreateInstallmentDto } from '../dtos/create-installment.dto'
import { PaymentPeriod } from '../entities/payment-period.entity'
import { LOAN_STATES, LoanStateValueTypes } from '../shared/constants'
import { LoanState } from '../entities/loan-state.entity'
import { PayOffDto } from '../dtos/pay-off.dto'

import { INSTALLMENT_STATES } from '../constants/installments'
import { INTEREST_STATE } from '../constants/interests'
import { FilterLoansDto } from '../dtos/filter-loans.dto'
import { InstallmentsService } from './installments.service'
import { InterestRepository } from '../repositories/interest.repository'

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan) private repository: Repository<Loan>,
    private interestRepository: InterestRepository,
    private customerService: CustomersService,
    private employeeService: EmployeesService,
    @Inject(forwardRef(() => InstallmentsService)) private installmentService: InstallmentsService,
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
    /*
    const paginator = new FilterPaginator(this.repository, {
      itemsPerPage: 10,
      relations: ['customer', 'employee'],
    })
    */
    /*
    const result = paginator
      .filter({ loanStateId: params.state })
      .search(params.searchBy, params.searchValue)
      .paginate(params.page)
      .execute()
    */
    const loans = this.repository
      .createQueryBuilder('loans')
      .leftJoinAndSelect('loans.customer', 'customer')
      .leftJoinAndSelect('loans.employee', 'employee')

    if (params.interestState) {
      loans
        .innerJoin('interests', 'i', 'loans.id = i.loan_id')
        .where('i.interest_state_id = :interestStateId', {
          interestStateId: params.interestState,
        })
        .andWhere('loan_state_id = :loanState', { loanState: params.state })
    } else {
      loans.where('loan_state_id = :loanState', { loanState: params.state })
    }

    if (params.client) loans.andWhere('customer.name LIKE :client', { client: `${params.client}%` })

    loans.take(params.itemsPerPage).skip(params.itemsPerPage * (params.page - 1))

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

  update(id: number, updateLoanDto: UpdateLoanDto) {}

  async rawUpdate(id: number, updateLoanDto: UpdateLoanDto) {
    return await this.repository
      .createQueryBuilder()
      .update(Loan)
      .set(updateLoanDto)
      .where('id = :id', { id })
      .execute()
  }

  getLoansByState(loanStateId: LoanStateValueTypes) {
    return this.repository
      .createQueryBuilder('loans')
      .where('loan_state_id = :id', { id: LOAN_STATES.IN_PROGRESS })
      .getMany()
  }

  async payOff(loanId: number, payOffDto: PayOffDto) {
    const loan = await this.findOne(loanId, ['employee'])

    const interests = await this.interestRepository.findBy({
      loanId: loan.id,
      state: Not(INTEREST_STATE.PAID),
    })
    if (interests.length === 0) throw new NotFoundException('Intereses no encontrados')

    const interestIds = interests.map((i) => i.id)

    let totalInterestToPay = await this.interestRepository.getInterestsAmount(interestIds)
    console.log(totalInterestToPay)
    const totalDebt = Number(totalInterestToPay) + Number(loan.debt)
    if (payOffDto.amount) {
      if (payOffDto.amount <= totalDebt) throw new BadRequestException('Monto insuficiente')
      totalInterestToPay = payOffDto.amount - Number(loan.debt)
    }
    console.log(totalInterestToPay)
    const installmentData: CreateInstallmentDto = {
      loanId,
      installmentStateId: INSTALLMENT_STATES.PAID,
      paymentMethodId: payOffDto.paymentMethodId,
      debt: loan.debt,
      capital: loan.debt,
      interest: totalInterestToPay,
      total: totalDebt,
      interestIds,
    }
    const rs = await this.installmentService.create(loan, installmentData)

    return rs
  }
}
