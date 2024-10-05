import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { DataSource, In } from 'typeorm'
import { InstallmentRepository } from 'src/loans/repositories/installment.repository'
import { CreateInstallmentDto } from 'src/loans/dtos/create-installment.dto'
import { UpdateLoanDto } from 'src/loans/dtos/loans.dto'
import { LOAN_STATES } from 'src/loans/shared/constants'
import { INSTALLMENT_STATES } from 'src/loans/constants/installments'
import { INTEREST_STATE } from 'src/loans/constants/interests'
import { Loan } from 'src/loans/entities/loan.entity'
import { Installment } from 'src/loans/entities/installment.entity'
import { Interest } from 'src/loans/entities/interest.entity'
import { Commission } from 'src/employees/entities/commission.entity'
import { EmployeeBalance } from 'src/employees/entities/employee-balance.entity'
import { LoanManagementService } from '../loans-management/loans-management.service'

@Injectable()
export class InstallmentsService {
  constructor(
    private dataSource: DataSource,
    private loanService: LoanManagementService,
  ) {}

  private getNewLoanValues(loan: Loan, installment: CreateInstallmentDto) {
    const newCurrentInterest = Number(loan.currentInterest) - installment.interest
    const currentInterest = newCurrentInterest < 0 ? 0 : newCurrentInterest
    const totalInterestPaid = Number(loan.totalInterestPaid) + Number(installment.interest)
    const installmentsPaid = Number(loan.installmentsPaid) + 1
    const data: UpdateLoanDto = { currentInterest, totalInterestPaid, installmentsPaid }

    if (installment.capital > 0) {
      data.debt = Number(loan.debt) - installment.capital
    }
    if (data.debt === 0) data.loanStateId = LOAN_STATES.FINALIZED
    return data
  }

  async create(loanOrId: Loan | number, installmentData: CreateInstallmentDto) {
    const loan = await this.loanService.findOrReturnLoan(loanOrId)
    installmentData.debt = loan.debt
    installmentData.installmentStateId = INSTALLMENT_STATES.PAID

    const { interestIds } = installmentData

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

        await queryRunner.manager.update(
          EmployeeBalance,
          { employeeId: employeeId },
          { balance: Number(employeeBalance.balance) + commissionAmount },
        )
      }

      await queryRunner.commitTransaction()

      return installmentResult
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException()
    } finally {
      await queryRunner.release()
    }
  }
}
