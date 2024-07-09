import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { CreateInstallmentDto } from '../dtos/create-installment.dto'
import { INSTALLMENT_STATES } from '../constants/installments'
import { Loan } from '../entities/loan.entity'
import { LoansService } from './loans.service'
import { UpdateLoanDto } from '../dtos/loans.dto'
import { InstallmentRepository } from '../repositories/installment.repository'
import { InterestRepository } from '../repositories/interest.repository'
import { DataSource, In } from 'typeorm'
import { Installment } from '../entities/installment.entity'
import { Interest } from '../entities/interest.entity'
import { INTEREST_STATE } from '../constants/interests'
import { Commission } from 'src/employees/entities/commission.entity'
import { EmployeeBalance } from 'src/employees/entities/employee-balance.entity'

@Injectable()
export class InstallmentsService {
  constructor(
    private dataSource: DataSource,
    private repository: InstallmentRepository,
    private interestRepository: InterestRepository,
    private readonly loanService: LoansService,
  ) {}

  private async updateLoan(
    loanId: number,
    currentInterest: number,
    totalInterestPaid: number,
    installmentsPaid: number,
    lastInterestPayment: Date = new Date(),
  ) {
    const loanData: UpdateLoanDto = {
      currentInterest,
      totalInterestPaid,
      installmentsPaid,
      lastInterestPayment,
    }
    await this.loanService.rawUpdate(loanId, loanData)
  }

  getNewLoanValues(loan: Loan, installment: CreateInstallmentDto) {
    const newCurrentInterest = Number(loan.currentInterest) - installment.interest
    const currentInterest = newCurrentInterest < 0 ? 0 : newCurrentInterest
    const totalInterestPaid = Number(loan.totalInterestPaid) + installment.interest
    const installmentsPaid = Number(loan.installmentsPaid) + 1
    const data: UpdateLoanDto = { currentInterest, totalInterestPaid, installmentsPaid }

    if (installment.capital > 0) {
      data.debt = Number(loan.debt) - installment.capital
    }
    return data
  }

  async create(loanOrId: Loan | number, installmentData: CreateInstallmentDto) {
    const loan = await this.loanService.findOrReturnLoan(loanOrId)
    installmentData.debt = loan.debt
    installmentData.installmentStateId = INSTALLMENT_STATES.PAID

    const { interestIds } = installmentData

    const interestAmount = await this.interestRepository.getInterestsAmount(interestIds)

    if (Number(interestAmount) > installmentData.interest)
      throw new BadRequestException('El monto del interest no puede ser menor al del sistema')

    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      // const installmentObject = this.repository.createInstallmentObject(installmentData)

      // ** CREATE INSTALLMENT
      const installmentResult = await queryRunner.manager.insert(Installment, installmentData)

      // ** CREATE INSTALLMENT / INTEREST RELATION
      await queryRunner.manager
        .createQueryBuilder()
        .relation(Installment, 'interests')
        .of(installmentResult.raw.insertId)
        .add(interestIds)

      // ** UPDATE INTERESTS STATE
      await queryRunner.manager.update(
        Interest,
        { id: In(interestIds) },
        { interestStateId: INTEREST_STATE.PAID },
      )

      // ** UPDATE LOAN VALUES
      const loanValues = this.getNewLoanValues(loan, installmentData)
      await queryRunner.manager.update(Loan, loan.id, {
        ...loanValues,
      })

      if (loan.employee.id !== 1) {
        // ** Add commissions
        const employeeId = Number(loan.employee.id)
        const commissionAmount = installmentData.interest * 0.3
        await queryRunner.manager.insert(Commission, {
          employee: { id: employeeId },
          installment: { id: installmentResult.raw.insertId },
          interestAmount: installmentData.interest,
          amount: commissionAmount,
          rate: 30,
        })
        const employeeBalance = await queryRunner.manager.findOneBy(EmployeeBalance, {
          employeeId: employeeId,
        })
        console.log(employeeBalance, loan.employee)
        await queryRunner.manager.update(
          EmployeeBalance,
          { employeeId: employeeId },
          { balance: Number(employeeBalance.balance) + commissionAmount },
        )
      }

      await queryRunner.commitTransaction()

      return { installmentResult }
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction()
      return false
    } finally {
      await queryRunner.release()
    }
  }
}
