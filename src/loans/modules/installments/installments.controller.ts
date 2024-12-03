import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { UpdateInstallmentDto } from 'src/loans/dtos/update-installment.dto'
import { InstallmentsService } from './installments.service'
import { DailyInterestService } from '../daily-interest/daily-interest.service'
import { FilterPaginatorDto } from 'src/lib/filter-paginator/dtos/filter-paginator.dto'

@Controller('installments')
export class InstallmentsController {
  constructor(
    private readonly installmentService: InstallmentsService,
    private readonly dailyInterestService: DailyInterestService,
  ) {}

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: UpdateInstallmentDto) {
    return this.installmentService.update(id, data)
  }

  @Get(':id/daily-interest')
  dailyInterest(@Param('id') id: number, @Query() params: FilterPaginatorDto) {
    return this.dailyInterestService.findAllByInstallment(id, params)
  }
}
