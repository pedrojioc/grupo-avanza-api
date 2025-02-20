import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

import { InstallmentsService } from '../installments/installments.service'
import { LoanManagementService } from '../loans-management/loans-management.service'
import { AddPaymentDto } from './dtos/add-payment.dto'

import { InstallmentFactoryService } from '../installments/installment-factory.service'
import { PayOffDto } from 'src/loans/dtos/pay-off.dto'
import { CreateInstallmentDto } from 'src/loans/dtos/create-installment.dto'
import { Loan } from 'src/loans/entities/loan.entity'
import { INSTALLMENT_STATES } from 'src/loans/constants/installments'
import { CommissionsService } from 'src/employees/services/commissions.service'
import { Transactional } from 'src/shared/transactional/transactional.decorator'
import { DataSource, EntityManager } from 'typeorm'
import { EmployeesService } from 'src/employees/services/employees.service'
import { Payment } from 'src/loans/entities/payments.entity'
import { CreatePaymentDto } from './dtos/create-payment.dto'

@Injectable()
export class PaymentsService {
  constructor(
    private loanManagementService: LoanManagementService,
    private installmentService: InstallmentsService,
    private installmentFactoryService: InstallmentFactoryService,
    private commissionService: CommissionsService,
    private employeeService: EmployeesService,
    private dataSource: DataSource,
  ) {}

  async transactionalCreate(manager: EntityManager, createPaymentDto: CreatePaymentDto) {
    const rs = await manager.insert(Payment, createPaymentDto)
    await manager
      .createQueryBuilder()
      .relation(Payment, 'installments')
      .of(rs.raw.insertId)
      .add(createPaymentDto.installmentIds)
  }

  // ! SE DEBE VALIDAR CUANDO EL CAPITAL SEA MAYOR A 0 QUE NO EXISTAN CUOTAS ATRASADAS O PENDIENTES, DIFERENTE A LA CUOTA QUE SE ESTA PAGANDO
  async addPayment(paymentDto: AddPaymentDto) {
    const loan = await this.loanManagementService.findOne(paymentDto.loanId, ['employee'])

    if (paymentDto.capital > 0) {
      if (!paymentDto.installmentId) {
        return await this.paymentToCapital(paymentDto, loan)
      }
      await this.validatePaymentToCapital(loan.id, paymentDto.installmentId)
    } else if (paymentDto.capital === 0 && !paymentDto.installmentId) {
      throw new UnprocessableEntityException('Los pagos deben ser mayor a 0')
    }
    return await this.processInstallmentPayment(paymentDto, loan)
  }

  @Transactional()
  private async processInstallmentPayment(
    paymentDto: AddPaymentDto,
    loan: Loan,
    manager?: EntityManager,
  ) {
    try {
      const employeeId = loan.employee.id

      let installment = await this.installmentService.findOne(paymentDto.installmentId)
      const installmentDataUpd = this.installmentFactoryService.update(installment, paymentDto)

      installment = await this.installmentService.makePayment(
        manager,
        installment.id,
        installmentDataUpd,
      )

      let commissionAmount = 0
      const isFullyPaid = installment.installmentStateId === INSTALLMENT_STATES.PAID
      if (employeeId !== 1 && isFullyPaid) {
        const commissionData = this.commissionService.createCommissionData(
          employeeId,
          installment.id,
          installment.interestPaid,
        )
        commissionAmount = commissionData.amount
        await this.commissionService.transactionalCreate(manager, commissionData)
        await this.employeeService.transactionalUpdateBalance(manager, employeeId, commissionAmount)
      }

      // ? Calcular los días de atraso
      const daysLate = await this.installmentService.calculateDaysLate(loan.id)
      // ? Actualizar los datos del préstamo
      await this.loanManagementService.updateLoanAfterPayment(
        manager,
        loan,
        installment,
        daysLate,
        commissionAmount,
      )

      // ? Crear el pago
      await this.transactionalCreate(manager, {
        installmentId: installment.id,
        installmentIds: [installment.id],
        paymentMethodId: paymentDto.paymentMethodId,
        capital: installment.capital,
        interest: installment.interestPaid,
        total: installment.capital + installment.interestPaid,
        date: paymentDto.paymentDate || new Date(),
      })

      return installment
    } catch (error) {
      throw error
    }
  }

  @Transactional()
  async paymentToCapital(paymentDto: AddPaymentDto, loan: Loan, manager?: EntityManager) {
    await this.validatePaymentToCapital(loan.id)

    const { capital } = paymentDto
    const today = new Date()

    const installmentDto: CreateInstallmentDto = {
      loanId: loan.id,
      installmentStateId: INSTALLMENT_STATES.PAID,
      debt: 0,
      startsOn: today,
      paymentDeadline: today,
      days: 0,
      capital,
      interest: 0,
      interestPaid: 0,
      total: capital,
    }
    const installment = await this.installmentService.transactionalCreate(manager, installmentDto)
    await this.loanManagementService.updateLoanAfterPayment(manager, loan, installment, 0, 0)

    // ? Crear el pago
    await this.transactionalCreate(manager, {
      installmentId: installment.id,
      installmentIds: [installment.id],
      paymentMethodId: paymentDto.paymentMethodId,
      capital,
      interest: 0,
      total: capital,
      date: paymentDto.paymentDate || new Date(),
    })
    return installment
  }

  async payOff(loanId: number, addPaymentDto: PayOffDto) {
    const loan = await this.loanManagementService.findOne(loanId, ['employee'])

    const installments = await this.installmentService.findUnpaidInstallments(loanId)
    if (installments.length === 0) throw new NotFoundException('Cuotas no encontrados')

    for (const installment of installments) {
      const installmentUpdate = this.installmentFactoryService.update(installment, addPaymentDto)
      // await this.processInstallmentPayment(installment, installmentUpdate, loan)
    }
  }

  private async hasUnpaidInstallments(loanId: number, installmentId?: number): Promise<Boolean> {
    const installments = await this.installmentService.findUnpaidInstallments(loanId, installmentId)
    return !!installments.length
  }

  private async validatePaymentToCapital(loanId: number, installmentId?: number) {
    const hasInstallments = await this.hasUnpaidInstallments(loanId, installmentId)
    if (hasInstallments) {
      throw new UnprocessableEntityException('Operación inválida, existen cuotas sin pagar')
    }
  }
}
