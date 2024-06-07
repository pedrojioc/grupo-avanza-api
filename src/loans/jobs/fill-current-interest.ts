import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/app.module'
import { InterestsService } from '../services/interests.service'
import { LoansModule } from '../loans.module'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const interestService = app.select(LoansModule).get(InterestsService, { strict: true })
  await interestService.fillPendingInterest()
  await app.close()
}

bootstrap()
