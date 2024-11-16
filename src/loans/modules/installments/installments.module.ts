import { Module } from '@nestjs/common'
import { InstallmentsService } from './installments.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Installment } from 'src/loans/entities/installment.entity'
import { LoansManagementModule } from '../loans-management/loans-management.module'
import { InstallmentRepository } from 'src/loans/repositories/installment.repository'
import { InterestsModule } from '../interests/interests.module'
import { InstallmentFactoryService } from './installment-factory.service'

@Module({
  imports: [TypeOrmModule.forFeature([Installment]), LoansManagementModule, InterestsModule],
  providers: [InstallmentsService, InstallmentRepository, InstallmentFactoryService],
  exports: [InstallmentsService, InstallmentFactoryService],
})
export class InstallmentsModule {}
