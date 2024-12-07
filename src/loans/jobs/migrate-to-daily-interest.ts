import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/app.module'
import { LoansModule } from '../loans.module'
import { DailyInterestService } from '../modules/daily-interest/daily-interest.service'
import { DailyInterestModule } from '../modules/daily-interest/daily-interest.module'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const dailyInterestService = app
    .select(DailyInterestModule)
    .get(DailyInterestService, { strict: true })
  await dailyInterestService.fillDebt()
  await app.close()
}

bootstrap()
