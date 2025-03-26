import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common'
import { Request } from 'express'

import { CreateLoanDto } from 'src/loans/dtos/loans.dto'
import { LoansService } from 'src/loans/services/loans.service'
import { InterestsService } from '../modules/interests/interests.service'

import { FilterPaginatorDto } from 'src/lib/filter-paginator/dtos/filter-paginator.dto'
import { FilterLoansDto } from '../dtos/filter-loans.dto'
import { AddPaymentDto } from '../modules/payments/dtos/add-payment.dto'
import { InstallmentsService } from '../modules/installments/installments.service'
import { AuthJwtPayload } from 'src/auth/types/token.model'

@Controller('loans')
export class LoansController {
  constructor(
    private loansService: LoansService,
    private interestService: InterestsService,
    private installmentsService: InstallmentsService,
  ) {}

  @Post()
  create(@Body() payload: CreateLoanDto) {
    return this.loansService.create(payload)
  }

  @Get()
  findAll(@Req() req: Request, @Query() params: FilterLoansDto) {
    const user = req.user as AuthJwtPayload
    return this.loansService.findAll(params, user.role, user.sub)
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.loansService.findOne(id, ['customer', 'employee', 'loanState'])
  }

  @Get(':id/interests')
  findInterests(@Param('id') id: number, @Query() params: FilterPaginatorDto) {
    return this.interestService.findAllByLoan(id, params)
  }

  @Get(':id/installments')
  findInstallments(@Param('id') id: number, @Query() params: FilterPaginatorDto) {
    return this.installmentsService.findAllByLoan(id, params)
  }

  @Post(':id/pay-off')
  payOff(@Param('id') id: number, @Body() data: AddPaymentDto) {
    return this.loansService.payOff(id, data)
  }
}
