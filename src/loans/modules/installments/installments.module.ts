import { Module } from '@nestjs/common'
import { InstallmentsService } from './installments.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Installment } from 'src/loans/entities/installment.entity'

import { LoansManagementModule } from '../loans-management/loans-management.module'
import { InstallmentRepository } from 'src/loans/repositories/installment.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Installment]), LoansManagementModule],
  providers: [InstallmentsService, InstallmentRepository],
  exports: [InstallmentsService],
})
export class InstallmentsModule {}
