import { Body, Controller, Param, Post } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { AddPaymentDto } from './dtos/add-payment.dto'
import { PartialPaymentDto } from './dtos/partial-payment.dto'
import { AddCapitalPaymentDto } from './dtos/add-capital-payment.dto'

@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Post()
  payments(@Body() data: AddPaymentDto) {
    return this.paymentService.addPayment(data)
  }

  @Post('capital')
  capital(@Body() data: AddCapitalPaymentDto) {
    return this.paymentService.capitalPayment(data)
  }
}
