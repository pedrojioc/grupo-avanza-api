import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'

import { PayOffDto } from 'src/loans/dtos/pay-off.dto'
import { InterestsService } from '../interests/interests.service'
import { CreateInstallmentDto } from 'src/loans/dtos/create-installment.dto'
import { INSTALLMENT_STATES } from 'src/loans/constants/installments'
import { Loan } from 'src/loans/entities/loan.entity'
import { InstallmentsService } from '../installments/installments.service'
import { LoanManagementService } from '../loans-management/loans-management.service'
import { AddPaymentDto } from './dtos/add-payment.dto'
import { Interest } from 'src/loans/entities/interest.entity'

@Injectable()
export class PaymentsService {
  constructor(
    private loanManagementService: LoanManagementService,
    private interestService: InterestsService,
    private installmentService: InstallmentsService,
  ) {}

  async addPayment(paymentDto: AddPaymentDto) {
    const loan = await this.loanManagementService.findOne(paymentDto.loanId, ['employee'])
    if (paymentDto.capital > 0 && paymentDto.interestIds.length === 0) {
      await this.validatePaymentToCapital(loan.id)
    }
    if (paymentDto.capital === 0 && paymentDto.interestIds.length === 0) {
      throw new UnprocessableEntityException('Los pagos deben ser mayor a 0')
    }
    const installmentDta = await this.createInstallmentData(
      loan,
      paymentDto.interestIds,
      paymentDto,
    )
    const rs = await this.installmentService.create(loan, installmentDta)

    return rs
  }

  async payOff(loanId: number, addPaymentDto: AddPaymentDto) {
    const loan = await this.loanManagementService.findOne(loanId, ['employee'])

    const interests = await this.interestService.findUnpaidInterests(loanId)
    if (interests.length === 0) throw new NotFoundException('Intereses no encontrados')

    const interestIds = this.getInterestIds(interests)

    const installmentData = await this.createInstallmentData(loan, interestIds, addPaymentDto)
    installmentData.capital = loan.debt
    installmentData.total = Number(loan.debt) + installmentData.interest

    const rs = await this.installmentService.create(loan, installmentData)

    return rs
  }

  private async hasUnpaidInterest(loanId: number): Promise<Boolean> {
    const interests = await this.interestService.findUnpaidInterests(loanId)
    return !!interests.length
  }

  private async validatePaymentToCapital(loanId: number) {
    const hasInterests = await this.hasUnpaidInterest(loanId)
    if (hasInterests)
      throw new UnprocessableEntityException('Operación inválida, existen intereses no pagados')
  }

  private getInterestIds(interests: Interest[]) {
    return interests.map((i) => i.id)
  }

  private async createInstallmentData(
    loan: Loan,
    interestIds: number[],
    addPaymentDto: AddPaymentDto,
  ) {
    const interestAmount = await this.interestService.getInterestsAmount(interestIds) // !! Verificar si se deja aquí

    if (addPaymentDto.customInterest && addPaymentDto.customInterest < interestAmount) {
      throw new BadRequestException('Intereses insuficiente')
    }

    // if (!addPaymentDto.capital) throw new BadRequestException('Capital field is required')

    const interestToPay = addPaymentDto.customInterest
      ? addPaymentDto.customInterest
      : interestAmount
    const total = Number(interestToPay) + Number(addPaymentDto.capital)

    const installmentData: CreateInstallmentDto = {
      loanId: loan.id,
      installmentStateId: INSTALLMENT_STATES.PAID,
      paymentMethodId: addPaymentDto.paymentMethodId,
      debt: loan.debt,
      capital: addPaymentDto.capital,
      interest: interestToPay,
      total: total,
      interestIds,
    }
    console.log('Line 102', installmentData)
    return installmentData
  }
}
