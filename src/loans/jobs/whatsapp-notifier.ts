import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/app.module'
import { NotificationsModule } from 'src/notifications/notifications.module'
import { WhatsAppService } from 'src/notifications/whatsapp.service'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const whatsAppService = app.select(NotificationsModule).get(WhatsAppService, { strict: true })
  await whatsAppService.runNotifications()
  console.log('Done :)')
  await app.close()
}

bootstrap()
