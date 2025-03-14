import { Body, Controller, Get, Patch, Post, Query, Req } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { AddPaymentDto } from './dtos/add-payment.dto'
import { AddCapitalPaymentDto } from './dtos/add-capital-payment.dto'
import { FilterPaymentsDto } from './dtos/filter-payments.dto'
import { MarkPaymentAsReceived } from './dtos/bulk-received.dto'

@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Get()
  findAll(@Query() params: FilterPaymentsDto) {
    return this.paymentService.findAll(params)
  }

  @Post()
  create(@Body() data: AddPaymentDto) {
    return this.paymentService.addPayment(data)
  }

  @Post('capital')
  capital(@Body() data: AddCapitalPaymentDto) {
    return this.paymentService.capitalPayment(data)
  }

  @Patch('received')
  checked(@Body() data: MarkPaymentAsReceived) {
    return this.paymentService.markAsReceived(data)
  }

  @Get('/summary')
  summary(@Query() params: FilterPaymentsDto) {
    return this.paymentService.summary(params)
  }
}
