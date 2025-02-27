import { DataSource, EntityManager, FindOptionsWhere, Repository } from 'typeorm'
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { diffDays, format } from '@formkit/tempo'

import { INSTALLMENT_STATES } from 'src/loans/constants/installments'
import { CreateInstallmentDto } from 'src/loans/dtos/create-installment.dto'
import { UpdateInstallmentDto } from 'src/loans/dtos/update-installment.dto'
import { Installment } from 'src/loans/entities/installment.entity'
import { Interest } from 'src/loans/entities/interest.entity'
import { INTEREST_STATE } from 'src/loans/constants/interests'
import { FilterPaginatorDto } from 'src/lib/filter-paginator/dtos/filter-paginator.dto'
import { FilterPaginator } from 'src/lib/filter-paginator'
import { InstallmentState } from 'src/loans/entities/installment-state.entity'

@Injectable()
export class InstallmentsService {
  private DATE_FORMAT = 'YYYY-MM-DD'
  private today = format(new Date(), this.DATE_FORMAT)

  constructor(
    @InjectRepository(Installment) private repository: Repository<Installment>,
    private dataSource: DataSource,
  ) {}

  create(installmentDto: CreateInstallmentDto) {
    const installment = this.repository.create(installmentDto)
    // this.dataSource.createQueryBuilder().insert().into(Installment).values(installmentDto)
    return this.repository.save(installment)
  }

  update(id: number, installmentDto: UpdateInstallmentDto) {
    return this.repository.update(id, installmentDto)
  }

  async findOne(id: number) {
    const installment = await this.repository.findOneBy({ id })
    if (!installment) throw new NotFoundException()
    return installment
  }

  findAllByLoan(loanId: number, params: FilterPaginatorDto) {
    const whereOptions: FindOptionsWhere<Installment> = {}

    if (params.state) {
      // const installmentState = { id: params.state } as InstallmentState
      whereOptions.installmentStateId = params.state
    }

    const paginator = new FilterPaginator(this.repository, {
      where: { loanId, ...whereOptions },
      relations: ['installmentState'],
    })
    const result = paginator.paginate(1).execute()
    return result
  }

  async bulkUpdate(installmentIds: number[], updateInstallmentDto: UpdateInstallmentDto) {
    await this.repository
      .createQueryBuilder()
      .update(Installment)
      .set(updateInstallmentDto)
      .whereInIds(installmentIds)
      .execute()
  }

  async transactionalCreate(manager: EntityManager, installmentDto: CreateInstallmentDto) {
    const installment = manager.create(Installment, installmentDto)
    return await manager.save(installment)
  }

  private async findOldestInstallment(manager: EntityManager, loanId: number) {
    const installment = await manager.findOne(Installment, {
      where: { loanId, installmentStateId: INSTALLMENT_STATES.OVERDUE },
      order: { paymentDeadline: 'ASC' },
    })

    return installment
  }

  async getCurrentInstallment(loanId: number, date: Date) {
    const installment = await this.repository
      .createQueryBuilder('interest')
      .where(
        'loan_id = :loanId AND installment_state_id = :installmentStateId AND payment_deadline >= :currentDate',
        {
          loanId,
          installmentStateId: INSTALLMENT_STATES.IN_PROGRESS,
          currentDate: date,
        },
      )
      .getOne()

    return installment
  }

  async calculateDaysLate(loanId: number, manager: EntityManager) {
    const installment = await this.findOldestInstallment(manager, loanId)

    if (!installment) return 0

    const today = this.today
    const deadline = format(installment.paymentDeadline, this.DATE_FORMAT)
    const daysLate = diffDays(today, deadline)

    return daysLate
  }

  findUnpaidInstallments(loanId: number, installmentId?: number) {
    const query = this.repository
      .createQueryBuilder()
      .where('loan_id = :loanId', { loanId })
      .andWhere('installment_state_id <> :state', {
        state: INSTALLMENT_STATES.PAID,
      })
      .andWhere(':today >= payment_deadline', {
        today: this.today,
      })

    if (installmentId) query.andWhere('id <> :installmentId', { installmentId })

    return query.getMany()
  }

  async getAmountOfInterestInArrears(loanId: number) {
    const { amount } = await this.repository
      .createQueryBuilder()
      .select('SUM(interest)', 'amount')
      .where('loan_id = :loanId', { loanId })
      .andWhere('installment_state_id = :state', {
        state: INSTALLMENT_STATES.OVERDUE,
      })
      .getRawOne()

    return amount
  }

  async makePayment(
    manager: EntityManager,
    installmentId: number,
    updateInstallmentDto: UpdateInstallmentDto,
  ) {
    await manager.update(Installment, { id: installmentId }, updateInstallmentDto)
    const i = await manager.findOneBy(Installment, { id: installmentId })

    return i
  }

  getStates() {
    return this.dataSource.manager.find(InstallmentState)
  }
}
