import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { INTEREST_STATE } from 'src/loans/constants/interests'
import { Interest } from 'src/loans/entities/interest.entity'
import { Loan } from 'src/loans/entities/loan.entity'
import { LOAN_STATES } from 'src/loans/shared/constants'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class LoanReportsService {
  constructor(
    @InjectRepository(Loan) private repository: Repository<Loan>,
    private dataSource: DataSource,
  ) {}

  getCurrentCapital() {
    return this.repository
      .createQueryBuilder('loan')
      .select('SUM(amount) AS invested, SUM(debt) AS debt')
      .where('loan_state_id', { loanStateId: LOAN_STATES.IN_PROGRESS })
      .getRawOne()
  }

  async getPendingInterest() {
    const { total } = await this.dataSource
      .createQueryBuilder()
      .select('SUM(interest.amount)', 'total')
      .from(Interest, 'interest')
      .where('interest.interest_state_id <> :paidId', {
        paidId: INTEREST_STATE.PAID,
      })
      .andWhere('interest.interest_state_id <> :inProgressId', {
        inProgressId: INTEREST_STATE.IN_PROGRESS,
      })
      .getRawOne()

    return total
  }

  countCurrentLoans() {
    return this.repository.count({ where: { loanStateId: LOAN_STATES.IN_PROGRESS } })
  }

  async countOverdueLoans() {
    const { count } = await this.repository
      .createQueryBuilder('loan')
      .select('COUNT(loan.id) as count')
      .where('days_late > 0')
      .getRawOne()

    return count
  }

  async getLoansAmountGroupedByAdvisor() {
    const data = await this.repository
      .createQueryBuilder('loan')
      .select(
        'employee.name AS advisor, SUM(loan.amount) AS invested, SUM(loan.debt) AS debt, COUNT(loan.id) AS count',
      )
      .innerJoin('employees', 'employee', 'employee.id = loan.employee_id')
      .where('loan_state_id = :loanStateId', { loanStateId: LOAN_STATES.IN_PROGRESS })
      .groupBy('advisor')
      .getRawMany()

    return data
  }

  async getUnpaidInterestGroupedByAdvisor() {
    const data = await this.repository
      .createQueryBuilder('loan')
      .select('employee.name AS advisor')
      .addSelect('SUM(interest.amount)', 'amount')
      .innerJoin('interests', 'interest', 'interest.loan_id = loan.id')
      .innerJoin('employees', 'employee', 'employee.id = loan.employee_id')
      .where('interest.interest_state_id = :awaitingId', {
        awaitingId: INTEREST_STATE.AWAITING_PAYMENT,
      })
      .orWhere('interest.interest_state_id = :overdueId', {
        overdueId: INTEREST_STATE.OVERDUE,
      })
      .groupBy('advisor')
      .getRawMany()

    return data
  }
}
