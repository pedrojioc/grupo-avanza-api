import { DataSource, Repository } from 'typeorm'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { diffDays, format } from '@formkit/tempo'

import { INSTALLMENT_STATES } from 'src/loans/constants/installments'
import { CreateInstallmentDto } from 'src/loans/dtos/create-installment.dto'
import { UpdateInstallmentDto } from 'src/loans/dtos/update-installment.dto'
import { Loan } from 'src/loans/entities/loan.entity'
import { Installment } from 'src/loans/entities/installment.entity'
import { Commission } from 'src/employees/entities/commission.entity'
import { EmployeeBalance } from 'src/employees/entities/employee-balance.entity'
import { LoanFactoryService } from 'src/loans/modules/loans-management/loan-factory.service'
import { Interest } from 'src/loans/entities/interest.entity'
import { INTEREST_STATE } from 'src/loans/constants/interests'

@Injectable()
export class InstallmentsService {
  private DATE_FORMAT = 'YYYY-MM-DD'
  constructor(
    @InjectRepository(Installment) private repository: Repository<Installment>,
    private dataSource: DataSource,
    private loanFactoryService: LoanFactoryService,
  ) {}

  create(installmentDto: CreateInstallmentDto) {
    const installment = this.repository.create(installmentDto)
    // this.dataSource.createQueryBuilder().insert().into(Installment).values(installmentDto)
    return this.repository.save(installment)
  }

  update(id: number, installmentDto: UpdateInstallmentDto) {
    return this.repository.update(id, installmentDto)
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id })
  }

  async findOldestInstallment(loanId: number) {
    const installment = await this.repository
      .createQueryBuilder('installment')
      .where('loan_id = :loanId AND installment_state_id = :installmentStateId', {
        loanId,
        installmentStateId: INSTALLMENT_STATES.OVERDUE,
      })
      .orderBy('payment_deadline', 'ASC')
      .getOne()

    return installment
  }

  async getCurrentInstallment(loanId: number) {
    const installment = await this.repository
      .createQueryBuilder('interest')
      .where('loan_id = :loanId AND installment_state_id = :installmentStateId', {
        loanId,
        installmentStateId: INSTALLMENT_STATES.IN_PROGRESS,
      })
      .getOne()

    return installment
  }

  async calculateDaysLate(loanId: number) {
    const installment = await this.findOldestInstallment(loanId)

    if (!installment) return 0

    const today = format(new Date(), this.DATE_FORMAT)
    const deadline = format(installment.paymentDeadline, this.DATE_FORMAT)
    const daysLate = diffDays(today, deadline)

    return daysLate
  }

  findUnpaidInstallments(loanId: number) {
    return this.repository
      .createQueryBuilder('installments')
      .where('loan_id = :loanId', { loanId })
      .andWhere('installment_state_id = :overdue OR installment_state_id = :awaiting', {
        overdue: INSTALLMENT_STATES.OVERDUE,
        awaiting: INSTALLMENT_STATES.AWAITING_PAYMENT,
      })
      .getMany()
  }

  async makePayment(installmentId: number, updateInstallmentDto: UpdateInstallmentDto, loan: Loan) {
    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // TODO: Actualizar el estado de la cuota y el total
      const rs = await queryRunner.manager
        .createQueryBuilder()
        .update(Installment)
        .set(updateInstallmentDto)
        .where('id = :id', { id: installmentId })
        .execute()

      // TODO: Actualizar el currentInterest en loans y la deuda en caso de pago a capital, etc
      const daysLate = await this.calculateDaysLate(loan.id)
      const loanData = this.loanFactoryService.valuesAfterPayment(
        loan,
        updateInstallmentDto,
        daysLate,
      )
      await queryRunner.manager
        .createQueryBuilder()
        .update(Loan)
        .set(loanData)
        .where('id = :loanId', { loanId: loan.id })
        .execute()

      // TODO: Agregar la comisión al asesor
      if (loan.employee.id !== 1) {
        // ** Add commissions
        const employeeId = Number(loan.employee.id)
        const commissionAmount = updateInstallmentDto.interest * 0.3
        await queryRunner.manager.insert(Commission, {
          employee: { id: employeeId },
          installment: { id: installmentId },
          interestAmount: updateInstallmentDto.interest,
          amount: commissionAmount,
          rate: 30,
        })
        const employeeBalance = await queryRunner.manager.findOneBy(EmployeeBalance, {
          employeeId: employeeId,
        })

        await queryRunner.manager.update(
          EmployeeBalance,
          { employeeId: employeeId },
          { balance: Number(employeeBalance.balance) + commissionAmount },
        )
      }
      await queryRunner.commitTransaction()
      return rs
    } catch (error) {
      await queryRunner.rollbackTransaction()
      console.log(error)
      throw new InternalServerErrorException(error)
    } finally {
      await queryRunner.release()
    }
  }

  async migrateInterestToInstallment() {
    const interestRepository = this.dataSource.getRepository(Interest)
    const interests = await interestRepository
      .createQueryBuilder('interests')
      .where('interest_state_id <> :paid', {
        paid: INTEREST_STATE.PAID,
      })
      .orderBy('deadline', 'ASC')
      .getMany()

    for (const interest of interests) {
      const installmentData: CreateInstallmentDto = {
        loanId: interest.loanId,
        installmentStateId: interest.interestStateId,
        debt: interest.capital,
        startsOn: interest.startAt,
        paymentDeadline: interest.deadline,
        days: interest.days,
        capital: 0,
        interest: interest.amount,
        total: 0,
      }

      const rs = await this.create(installmentData)
      console.log('Cuota creada: ', rs.id)
    }

    console.log('Tarea finalizada!')
  }
}
