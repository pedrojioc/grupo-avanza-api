import { Injectable } from '@nestjs/common'
import { InjectBot } from 'nestjs-telegraf'
import { InstallmentsService } from 'src/loans/modules/installments/installments.service'
import { LoanManagementService } from 'src/loans/modules/loans-management/loans-management.service'
import { currencyFormat } from 'src/utils/number-format'
import { Telegraf } from 'telegraf'

@Injectable()
export class TelegramNotificationsService {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly loanManagementService: LoanManagementService,
    private readonly installmentService: InstallmentsService,
  ) {}

  async runNotifications() {
    const loans = await this.loanManagementService.getLoansInDefault({
      customer: true,
      employee: { user: true },
    })
    console.log(loans.length)
    const grouped = {}
    for (const loan of loans) {
      const { daysLate } = loan
      const amountInArrears = await this.installmentService.getAmountOfInterestInArrears(loan.id)
      const pendingAmount = currencyFormat(amountInArrears)
      const item = `<strong>${loan.customer.name}</strong> \n Monto: ${pendingAmount} \n Días en mora: ${daysLate} \n _____________________________________ \n`
      const key = loan.employee.user?.chatId || 'NO_AUTH'
      if (!grouped[key]) {
        grouped[key] = `${item}`
      } else {
        grouped[key] += `${item}`
      }
    }

    for (const [key, value] of Object.entries(grouped)) {
      if (key !== 'NO_AUTH') {
        await this.bot.telegram.sendMessage(key, grouped[key], { parse_mode: 'HTML' })
      }
    }

    console.log('Notificaciones enviadas!')
  }
}
