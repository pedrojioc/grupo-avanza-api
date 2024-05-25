import { Module } from '@nestjs/common'
import { PaymentMethodsService } from './services/payment-methods.service'
import { PaymentMethodsController } from './controllers/payment-methods.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaymentMethod } from './entities/payment-method.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  providers: [PaymentMethodsService],
  controllers: [PaymentMethodsController],
})
export class PaymentMethodsModule {}
