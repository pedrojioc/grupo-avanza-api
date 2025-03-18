import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/app.module'
import { NotificationsModule } from 'src/notifications/notifications.module'
import { TelegramNotificationsService } from 'src/notifications/telegram-notifications.service'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const telegramService = app
    .select(NotificationsModule)
    .get(TelegramNotificationsService, { strict: true })
  await telegramService.runNotifications()
  console.log('Notificaciones enviadas!')
  await app.close()
}

bootstrap()
