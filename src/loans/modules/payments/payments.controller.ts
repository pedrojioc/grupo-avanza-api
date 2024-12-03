import { Body, Controller, Param, Post } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { AddPaymentDto } from './dtos/add-payment.dto'
import { PartialPaymentDto } from './dtos/partial-payment.dto'

@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Post()
  payments(@Body() data: AddPaymentDto) {
    return this.paymentService.addPayment(data)
  }
}
