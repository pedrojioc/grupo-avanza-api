import { Controller, Get } from '@nestjs/common'
import { PaymentPeriodsService } from '../services/payment-periods.service'

@Controller('payment-periods')
export class PaymentPeriodsController {
  constructor(private readonly paymentPeriodsService: PaymentPeriodsService) {}
  @Get()
  findAll() {
    return this.paymentPeriodsService.findAll()
  }
}
