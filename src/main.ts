import { NestFactory, Reflector } from '@nestjs/core'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { getBotToken } from 'nestjs-telegraf'
import * as cookieParser from 'cookie-parser'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  )
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))) // Activate serializer
  app.enableCors({ origin: process.env.CONSUMER_URL, credentials: true })

  app.use(cookieParser())

  const bot = app.get(getBotToken())
  app.use(bot.webhookCallback(process.env.TELEGRAM_HOOK_PATH))

  // process.once('SIGINT', () => bot.stop('SIGINT'))
  // process.once('SIGTERM', () => bot.stop('SIGTERM'))

  await app.listen(3000)
}
bootstrap()
