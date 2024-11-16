import { PartialType } from '@nestjs/mapped-types'
import { IsOptional, IsPositive } from 'class-validator'
import { AddPaymentDto } from '../modules/payments/dtos/add-payment.dto'

export class PayOffDto extends PartialType(AddPaymentDto) {
  instalmentId?: number
}
