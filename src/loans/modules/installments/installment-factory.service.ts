import { BadRequestException, Injectable } from '@nestjs/common'
import { Installment } from 'src/loans/entities/installment.entity'
import { AddPaymentDto } from '../payments/dtos/add-payment.dto'
import { UpdateInstallmentDto } from 'src/loans/dtos/update-installment.dto'
import { INSTALLMENT_STATES } from 'src/loans/constants/installments'
import { PayOffDto } from 'src/loans/dtos/pay-off.dto'

@Injectable()
export class InstallmentFactoryService {
  update(installment: Installment, addPaymentDto: AddPaymentDto | PayOffDto) {
    if (addPaymentDto.customInterest && addPaymentDto.customInterest < installment.interest) {
      throw new BadRequestException('Intereses insuficiente')
    }

    // if (!addPaymentDto.capital) throw new BadRequestException('Capital field is required')

    const interestToPay = addPaymentDto.customInterest
      ? addPaymentDto.customInterest
      : installment.interest

    const total = Number(interestToPay) + Number(addPaymentDto.capital)
    const { capital, paymentMethodId } = addPaymentDto
    const installmentData: UpdateInstallmentDto = {
      paymentMethodId,
      interest: interestToPay,
      capital,
      total,
      installmentStateId: INSTALLMENT_STATES.PAID,
    }

    return installmentData
  }
}
