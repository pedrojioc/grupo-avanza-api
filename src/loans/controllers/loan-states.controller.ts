import { Controller, Get } from '@nestjs/common'
import { LoanStatesService } from '../services/loan-states.service'

@Controller('loan-states')
export class LoanStatesController {
  constructor(private readonly loanStatesService: LoanStatesService) {}
  @Get()
  findAll() {
    return this.loanStatesService.findAll()
  }
}
