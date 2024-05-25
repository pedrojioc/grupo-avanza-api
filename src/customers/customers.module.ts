import { Module } from '@nestjs/common'
import { CustomersService } from './services/customers.service'
import { CustomersController } from './controllers/customers.controller'
import { FinancialActivityService } from './services/financial-activity.service'
import { FinancialActivityController } from './controllers/financial-activity.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Customer } from './entities/customer.entity'
import { FinancialActivity } from './entities/financial-activity.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Customer, FinancialActivity])],
  controllers: [CustomersController, FinancialActivityController],
  providers: [CustomersService, FinancialActivityService],
  exports: [CustomersService],
})
export class CustomersModule {}
