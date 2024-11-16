import { Module } from '@nestjs/common'
import { LoanManagementService } from './loans-management.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Loan } from 'src/loans/entities/loan.entity'
import { LoanFactoryService } from './loan-factory.service'

@Module({
  imports: [TypeOrmModule.forFeature([Loan])],
  providers: [LoanManagementService, LoanFactoryService],
  exports: [LoanManagementService, LoanFactoryService],
})
export class LoansManagementModule {}
