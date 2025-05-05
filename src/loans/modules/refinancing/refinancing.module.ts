import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RefinancingController } from './refinancing.controller'
import { RefinancingService } from './refinancing.service'
import { Refinancing } from './entities/refinancing.entity'
import { LoansManagementModule } from '../loans-management/loans-management.module'
import { InstallmentsModule } from '../installments/installments.module'

@Module({
  imports: [TypeOrmModule.forFeature([Refinancing]), LoansManagementModule, InstallmentsModule],
  providers: [RefinancingService],
  controllers: [RefinancingController],
})
export class RefinancingModule {}
