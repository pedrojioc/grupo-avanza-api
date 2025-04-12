import { Module } from '@nestjs/common'
import { InstallmentsService } from './installments.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Installment } from 'src/loans/entities/installment.entity'
import { LoansManagementModule } from '../loans-management/loans-management.module'
import { InstallmentRepository } from 'src/loans/repositories/installment.repository'
import { InterestsModule } from '../interests/interests.module'
import { InstallmentFactoryService } from './installment-factory.service'
import { InstallmentsController } from './installments.controller'
import { DailyInterestModule } from '../daily-interest/daily-interest.module'
import { InstallmentTypesController } from './installment-types.controller'
import { InstallmentTypesService } from './installment-types.service'
import { InstallmentType } from './entities/installment-type.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Installment, InstallmentType]),
    LoansManagementModule,
    InterestsModule,
    DailyInterestModule,
  ],
  providers: [
    InstallmentsService,
    InstallmentRepository,
    InstallmentFactoryService,
    InstallmentTypesService,
  ],
  exports: [InstallmentsService, InstallmentFactoryService],
  controllers: [InstallmentsController, InstallmentTypesController],
})
export class InstallmentsModule {}
