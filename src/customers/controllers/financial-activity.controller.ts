import { Body, Controller, Get, Post } from '@nestjs/common'
import { FinancialActivityService } from '../services/financial-activity.service'
import { CreateFinancialActivityDto } from '../dtos/create-financial-activity.dto'

@Controller('financial-activity')
export class FinancialActivityController {
  constructor(private readonly activityService: FinancialActivityService) {}

  @Post()
  create(@Body() payload: CreateFinancialActivityDto) {
    return this.activityService.create(payload)
  }

  @Get()
  findAll() {
    return this.activityService.findAll()
  }
}
