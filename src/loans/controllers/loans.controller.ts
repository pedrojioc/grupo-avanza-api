import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { CreateLoanDto } from 'src/loans/dtos/loans.dto'
import { LoansService } from 'src/loans/services/loans.service'
import { InterestsService } from 'src/loans/services/interests.service'
import { CreateInstallmentDto } from '../dtos/create-installment.dto'
import { FilterPaginatorDto } from 'src/lib/filter-paginator/dtos/filter-paginator.dto'

@Controller('loans')
export class LoansController {
  constructor(
    private loansService: LoansService,
    private interestService: InterestsService,
  ) {}

  @Post()
  create(@Body() payload: CreateLoanDto) {
    return this.loansService.create(payload)
  }

  @Get()
  findAll(@Query() params: FilterPaginatorDto) {
    return this.loansService.findAll(params)
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.loansService.findOne(id, ['customer', 'employee', 'loanState'])
  }

  @Get(':id/interests')
  findInterests(@Param('id') id: number) {
    return this.interestService.findAllByLoan(id)
  }

  @Post(':id/installments')
  createInstallment(@Param('id') id: number, @Body() data: CreateInstallmentDto) {
    return this.loansService.createInstallment(id, data)
  }
}
