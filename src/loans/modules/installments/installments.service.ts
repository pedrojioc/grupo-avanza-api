import { DataSource, EntityManager, Repository } from 'typeorm'
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
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
import { UpdateLoanDto } from 'src/loans/dtos/loans.dto'

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

  async findOne(id: number) {
    const installment = await this.repository.findOneBy({ id })
    if (!installment) throw new NotFoundException()
    return installment
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
      .createQueryBuilder()
      .where('loan_id = :loanId', { loanId })
      .andWhere('installment_state_id <> :paid AND installment_state_id <> :inProgress', {
        paid: INSTALLMENT_STATES.PAID,
        inProgress: INSTALLMENT_STATES.IN_PROGRESS,
      })
      .getMany()
  }

  async updateLoan(manager: EntityManager, loanData: UpdateLoanDto, loanId: number) {
    await manager
      .createQueryBuilder()
      .update(Loan)
      .set(loanData)
      .where('id = :loanId', { loanId })
      .execute()
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

      // TODO: Agregar la comisión al asesor
      let commissionAmount = 0
      if (loan.employee.id !== 1) {
        // ** Add commissions
        const employeeId = Number(loan.employee.id)
        commissionAmount = updateInstallmentDto.interest * 0.3
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

      // TODO: Actualizar el currentInterest en loans y la deuda en caso de pago a capital, etc
      const daysLate = await this.calculateDaysLate(loan.id)
      const loanData = this.loanFactoryService.valuesAfterPayment(
        loan,
        updateInstallmentDto,
        daysLate,
        commissionAmount,
      )
      await this.updateLoan(queryRunner.manager, loanData, loan.id)

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

  /*
    Desc: This is responsible for making a capital payment, creating a fee and updating the loan. 
  */
  async makePaymentToCapital(installmentDto: CreateInstallmentDto, loan: Loan) {
    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const rs = await queryRunner.manager.insert(Installment, installmentDto)
      const loanData = this.loanFactoryService.valuesAfterPayment(loan, installmentDto, 0, 0)
      await this.updateLoan(queryRunner.manager, loanData, loan.id)

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
