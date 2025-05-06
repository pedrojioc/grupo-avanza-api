import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Payment } from 'src/loans/entities/payments.entity'
import { InstallmentsService } from 'src/loans/modules/installments/installments.service'
import { Repository } from 'typeorm'

@Injectable()
export class ManualTasksService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    private readonly installmentService: InstallmentsService,
  ) {}

  async setLoanIdOnPayments() {
    const payments = await this.paymentRepo.find()
    for (const payment of payments) {
      /*
      const installment = await this.installmentService.findOne(payment.installmentId)
      await this.paymentRepo.update(payment.id, {
        loanId: installment.loanId,
      })
      */
    }

    console.log('Payments updated successfully')
  }
}
