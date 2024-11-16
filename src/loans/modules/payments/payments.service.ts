import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

import { InstallmentsService } from '../installments/installments.service'
import { LoanManagementService } from '../loans-management/loans-management.service'
import { AddPaymentDto } from './dtos/add-payment.dto'

import { InstallmentFactoryService } from '../installments/installment-factory.service'
import { PayOffDto } from 'src/loans/dtos/pay-off.dto'

@Injectable()
export class PaymentsService {
  constructor(
    private loanManagementService: LoanManagementService,
    private installmentService: InstallmentsService,
    private installmentFactoryService: InstallmentFactoryService,
  ) {}

  async addPayment(paymentDto: AddPaymentDto) {
    const loan = await this.loanManagementService.findOne(paymentDto.loanId, ['employee'])
    if (paymentDto.capital > 0 && !paymentDto.installmentId) {
      await this.validatePaymentToCapital(loan.id)
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
    if (hasInstallments)
      throw new UnprocessableEntityException('Operación inválida, existen cuotas sin pagar')
  }
}
