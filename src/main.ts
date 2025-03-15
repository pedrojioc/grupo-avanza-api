import { NestFactory, Reflector } from '@nestjs/core'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { getBotToken } from 'nestjs-telegraf'
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
  app.enableCors()

  const bot = app.get(getBotToken())
  app.use(bot.webhookCallback(process.env.TELEGRAM_HOOK_PATH))

  await app.listen(3000)
}
bootstrap()
