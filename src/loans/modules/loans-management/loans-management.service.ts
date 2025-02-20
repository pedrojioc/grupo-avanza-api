import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'

import { Loan } from 'src/loans/entities/loan.entity'
import { LoanStateValueTypes } from 'src/loans/shared/constants'
import { UpdateLoanDto } from 'src/loans/dtos/loans.dto'
import { LoanFactoryService } from './loan-factory.service'
import { Installment } from 'src/loans/entities/installment.entity'

@Injectable()
export class LoanManagementService {
  constructor(
    @InjectRepository(Loan) private repository: Repository<Loan>,
    private readonly loanFactoryService: LoanFactoryService,
  ) {}

  findOne(id: number, relations?: string[]) {
    return this.repository.findOne({
      where: { id },
      relations,
    })
  }

  async findOrReturnLoan(loanOrId: Loan | number): Promise<Loan> {
    let loan: Loan

    if (typeof loanOrId === 'number') {
      loan = await this.findOne(loanOrId, ['employee'])
    } else {
      loan = loanOrId
    }

    return loan
  }

  getLoansByState(loanStateId: LoanStateValueTypes) {
    return this.repository
      .createQueryBuilder('loans')
      .where('loan_state_id = :id', { id: loanStateId })
      .getMany()
  }

  async rawUpdate(id: number, updateLoanDto: UpdateLoanDto) {
    return await this.repository
      .createQueryBuilder()
      .update(Loan)
      .set(updateLoanDto)
      .where('id = :id', { id })
      .execute()
  }

  async transactionalUpdate(manager: EntityManager, id: number, updateLoanDto: UpdateLoanDto) {
    return await manager
      .createQueryBuilder()
      .update(Loan)
      .set(updateLoanDto)
      .where('id = :id', { id })
      .execute()
  }

  async updateLoanAfterPayment(
    manager: EntityManager,
    loan: Loan,
    installment: Installment,
    daysLate: number,
    commission: number,
  ) {
    const loanData = this.loanFactoryService.valuesAfterPayment(
      loan,
      installment,
      daysLate,
      commission,
    )

    return await this.transactionalUpdate(manager, loan.id, loanData)
  }
}
