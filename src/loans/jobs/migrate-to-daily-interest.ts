import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/app.module'
import { LoansModule } from '../loans.module'
import { InstallmentsService } from '../modules/installments/installments.service'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const installmentService = app.select(LoansModule).get(InstallmentsService, { strict: true })
  await installmentService.migrateInterestToInstallment()
  await app.close()
}

bootstrap()
