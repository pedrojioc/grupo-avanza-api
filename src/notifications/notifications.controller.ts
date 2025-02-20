import { Controller, Post } from '@nestjs/common'
import { WhatsAppService } from './whatsapp.service'
import { WhatsAppForDelayDto } from './dtos/whatsapp-for-delay.dto'

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  @Post('whatsapp')
  sendWhatsApp() {
    const data: WhatsAppForDelayDto = {
      name: 'Juan Amaya',
      days_late: 4,
      pending_amount: new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
      })
        .format(200000)
        .replace(/(\.|,)00$/g, ''),
      phone: '313',
    }
    return this.whatsAppService.sendMessage(data)
  }
}
