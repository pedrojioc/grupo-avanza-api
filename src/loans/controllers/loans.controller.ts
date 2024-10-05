import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common'
import { CreateLoanDto } from 'src/loans/dtos/loans.dto'
import { LoansService } from 'src/loans/services/loans.service'
import { InterestsService } from 'src/loans/services/interests.service'
import { CreateInstallmentDto } from '../dtos/create-installment.dto'
import { FilterPaginatorDto } from 'src/lib/filter-paginator/dtos/filter-paginator.dto'
import { PayOffDto } from '../dtos/pay-off.dto'
import { FilterLoansDto } from '../dtos/filter-loans.dto'
import { PaymentsService } from '../modules/payments/payments.service'
import { AddPaymentDto } from '../modules/payments/dtos/add-payment.dto'

@Controller('loans')
export class LoansController {
  constructor(
    private loansService: LoansService,
    private interestService: InterestsService,
    private paymentService: PaymentsService,
  ) {}

  @Post()
  create(@Body() payload: CreateLoanDto) {
    return this.loansService.create(payload)
  }

  @Get()
  findAll(@Query() params: FilterLoansDto) {
    return this.loansService.findAll(params)
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.loansService.findOne(id, ['customer', 'employee', 'loanState'])
  }

  @Get(':id/interests')
  findInterests(@Param('id') id: number, @Query() params: FilterPaginatorDto) {
    return this.interestService.findAllByLoan(id, params)
  }

  @Post(':id/installments')
  createInstallment(@Param('id', ParseIntPipe) id: number, @Body() data: AddPaymentDto) {
    return this.paymentService.addPayment(data)
  }

  @Post(':id/pay-off')
  payOff(@Param('id') id: number, @Body() data: AddPaymentDto) {
    return this.loansService.payOff(id, data)
  }
}
