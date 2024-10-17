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
    return this.repository.sum('debt', { loanStateId: LOAN_STATES.IN_PROGRESS })
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
}
