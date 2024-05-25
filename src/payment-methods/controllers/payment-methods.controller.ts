import { Controller, Get, Query } from '@nestjs/common'
import { PaymentMethodsService } from '../services/payment-methods.service'

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodService: PaymentMethodsService) {}

  @Get()
  findAll() {
    return this.paymentMethodService.findAll()
  }
}
