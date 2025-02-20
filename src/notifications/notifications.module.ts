import { Module } from '@nestjs/common'
import { WhatsAppService } from './whatsapp.service'
import { NotificationsController } from './notifications.controller'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  providers: [WhatsAppService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
