import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LoansController } from './controllers/loans.controller'
import { LoansService } from './services/loans.service'
import { Loan } from './entities/loan.entity'
import { CustomersModule } from 'src/customers/customers.module'
import { EmployeesModule } from 'src/employees/employees.module'
import { PaymentPeriod } from './entities/payment-period.entity'
import { LoanState } from './entities/loan-state.entity'
import { PaymentPeriodsService } from './services/payment-periods.service'
import { PaymentPeriodsController } from './controllers/payment-periods.controller'
import { LoanStatesService } from './services/loan-states.service'
import { LoanStatesController } from './controllers/loan-states.controller'
import { InterestsService } from './services/interests.service'
import { Interest } from './entities/interest.entity'
import { InterestState } from './entities/interest-state.entity'
import { InstallmentsService } from './services/installments.service'
import { Installment } from './entities/installment.entity'
import { PaymentMethod } from '../payment-methods/entities/payment-method.entity'
import { InstallmentState } from './entities/installment-state.entity'
import { InstallmentRepository } from './repositories/installment.repository'
import { InterestRepository } from './repositories/interest.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Loan,
      PaymentPeriod,
      LoanState,
      Interest,
      InterestState,
      Installment,
      InstallmentState,
      PaymentMethod,
    ]),
    CustomersModule,
    EmployeesModule,
  ],
  controllers: [LoansController, PaymentPeriodsController, LoanStatesController],
  providers: [
    LoansService,
    PaymentPeriodsService,
    LoanStatesService,
    InterestsService,
    InstallmentsService,
    InstallmentRepository,
    InterestRepository,
  ],
})
export class LoansModule {}
