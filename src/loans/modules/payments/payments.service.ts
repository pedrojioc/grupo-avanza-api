import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

import { InstallmentsService } from '../installments/installments.service'
import { LoanManagementService } from '../loans-management/loans-management.service'
import { AddPaymentDto } from './dtos/add-payment.dto'

import { InstallmentFactoryService } from '../installments/installment-factory.service'
import { PayOffDto } from 'src/loans/dtos/pay-off.dto'
import { CreateInstallmentDto } from 'src/loans/dtos/create-installment.dto'
import { Loan } from 'src/loans/entities/loan.entity'
import { INSTALLMENT_STATES } from 'src/loans/constants/installments'

@Injectable()
export class PaymentsService {
  constructor(
    private loanManagementService: LoanManagementService,
    private installmentService: InstallmentsService,
    private installmentFactoryService: InstallmentFactoryService,
  ) {}

  async addPayment(paymentDto: AddPaymentDto) {
    const loan = await this.loanManagementService.findOne(paymentDto.loanId, ['employee'])

    // ? When payment is only to capital
    if (paymentDto.capital > 0 && !paymentDto.installmentId) {
      return await this.paymentToCapital(paymentDto, loan)
    }
    if (paymentDto.capital === 0 && !paymentDto.installmentId) {
      throw new UnprocessableEntityException('Los pagos deben ser mayor a 0')
    }

    try {
      const installment = await this.installmentService.findOne(paymentDto.installmentId)
      const installmentUpdate = this.installmentFactoryService.update(installment, paymentDto)

      const rs = await this.installmentService.makePayment(installment.id, installmentUpdate, loan)

      return rs
    } catch (error) {
      throw new Error(error)
    }
  }

  async paymentToCapital(paymentDto: AddPaymentDto, loan: Loan) {
    await this.validatePaymentToCapital(loan.id)

    const today = new Date()
    const installmentDto: CreateInstallmentDto = {
      loanId: loan.id,
      installmentStateId: INSTALLMENT_STATES.PAID,
      debt: 0,
      startsOn: today,
      paymentDeadline: today,
      days: 0,
      capital: paymentDto.capital,
      interest: 0,
      total: paymentDto.capital,
    }
    const rs = await this.installmentService.makePaymentToCapital(installmentDto, loan)
    return rs
  }

  async payOff(loanId: number, addPaymentDto: PayOffDto) {
    const loan = await this.loanManagementService.findOne(loanId, ['employee'])

    const installments = await this.installmentService.findUnpaidInstallments(loanId)
    if (installments.length === 0) throw new NotFoundException('Cuotas no encontrados')

    for (const installment of installments) {
      const installmentUpdate = this.installmentFactoryService.update(installment, addPaymentDto)
      await this.installmentService.makePayment(installment.id, installmentUpdate, loan)
    }
  }

  private async hasUnpaidInstallments(loanId: number): Promise<Boolean> {
    const installments = await this.installmentService.findUnpaidInstallments(loanId)
    return !!installments.length
  }

  private async validatePaymentToCapital(loanId: number) {
    const hasInstallments = await this.hasUnpaidInstallments(loanId)
    if (hasInstallments) {
      throw new UnprocessableEntityException('Operación inválida, existen cuotas sin pagar')
    }
  }
}
