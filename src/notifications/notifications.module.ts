import { Module } from '@nestjs/common'
import { WhatsAppService } from './whatsapp.service'
import { NotificationsController } from './notifications.controller'
import { HttpModule } from '@nestjs/axios'
import { LoansManagementModule } from 'src/loans/modules/loans-management/loans-management.module'
import { InstallmentsModule } from 'src/loans/modules/installments/installments.module'
import { TelegramNotificationsService } from './telegram-notifications.service';

@Module({
  imports: [HttpModule, LoansManagementModule, InstallmentsModule],
  providers: [WhatsAppService, TelegramNotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
