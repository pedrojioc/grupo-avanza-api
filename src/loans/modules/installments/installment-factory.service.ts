import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { Installment } from 'src/loans/entities/installment.entity'
import { AddPaymentDto } from '../payments/dtos/add-payment.dto'
import { UpdateInstallmentDto } from 'src/loans/dtos/update-installment.dto'
import { INSTALLMENT_STATES } from 'src/loans/constants/installments'
import { PayOffDto } from 'src/loans/dtos/pay-off.dto'

@Injectable()
export class InstallmentFactoryService {
  update(installment: Installment, addPaymentDto: AddPaymentDto | PayOffDto) {
    if (installment.interestPaid > 0 && !addPaymentDto.customInterest) {
      throw new BadRequestException(
        'El monto de intereses no coinciden con los registrados en el sistema',
      )
    }

    let interestPaid = installment.interest
    if (addPaymentDto.customInterest) {
      interestPaid = installment.interestPaid + addPaymentDto.customInterest
    }
    if (interestPaid < installment.interest && addPaymentDto.capital > 0) {
      throw new UnprocessableEntityException('Intereses pendientes, pago a capital rechazado')
    }

    const total = Number(interestPaid) + Number(addPaymentDto.capital)
    const { capital } = addPaymentDto
    const installmentData: UpdateInstallmentDto = {
      capital,
      interestPaid,
      total,
    }

    if (interestPaid >= installment.interest) {
      installmentData.installmentStateId = INSTALLMENT_STATES.PAID
      installmentData.paymentDate = addPaymentDto.paymentDate
    }

    return installmentData
  }
}
