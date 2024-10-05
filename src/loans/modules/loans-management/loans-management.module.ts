import { Module } from '@nestjs/common'
import { LoanManagementService } from './loans-management.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Loan } from 'src/loans/entities/loan.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Loan])],
  providers: [LoanManagementService],
  exports: [LoanManagementService],
})
export class LoansManagementModule {}
