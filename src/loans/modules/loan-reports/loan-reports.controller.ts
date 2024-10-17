import { Controller, Get } from '@nestjs/common'
import { LoanReportsService } from './loan-reports.service'

@Controller('loan-reports')
export class LoanReportsController {
  constructor(private loanReportService: LoanReportsService) {}

  @Get('dashboard')
  async dashboard() {
    const capital = await this.loanReportService.getCurrentCapital()
    const pendingInterest = await this.loanReportService.getPendingInterest()
    const currentLoans = await this.loanReportService.countCurrentLoans()

    return { capital, pendingInterest, currentLoans }
  }
}
