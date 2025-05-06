import { Module } from '@nestjs/common'
import { ManualTasksService } from './services/manual-tasks.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Payment } from 'src/loans/entities/payments.entity'
import { InstallmentsModule } from 'src/loans/modules/installments/installments.module'

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), InstallmentsModule],
  providers: [ManualTasksService],
})
export class TasksModule {}
