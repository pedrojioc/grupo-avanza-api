import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import { Installment } from '../entities/installment.entity'
import { CreateInstallmentDto } from '../dtos/create-installment.dto'
import { Loan } from '../entities/loan.entity'
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity'
import { InstallmentState } from '../entities/installment-state.entity'

@Injectable()
export class InstallmentRepository extends Repository<Installment> {
  constructor(private dataSource: DataSource) {
    super(Installment, dataSource.createEntityManager())
  }

  async createInstallment(installmentDto: CreateInstallmentDto) {
    const { loanId, paymentMethodId, installmentStateId, interestIds, ...rest } = installmentDto

    const installmentObject = {
      loan: { id: loanId } as Loan,
      paymentMethod: { id: paymentMethodId } as PaymentMethod,
      installmentState: { id: installmentStateId } as InstallmentState,
      ...rest,
    }

    const installment = this.create(installmentObject)
    await this.insert(installment)

    await this.createQueryBuilder()
      .relation(Installment, 'interests')
      .of(installment.id)
      .add(interestIds)

    return installment
  }

  createInstallmentObject(installmentDto: CreateInstallmentDto) {
    const { loanId, paymentMethodId, installmentStateId, interestIds, ...rest } = installmentDto

    const installmentObject = {
      loan: { id: loanId } as Loan,
      paymentMethod: { id: paymentMethodId } as PaymentMethod,
      installmentState: { id: installmentStateId } as InstallmentState,
      ...rest,
    }
    return installmentObject
  }
}
