import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { CreateCommissionDto } from '../dtos/create-commission.dto'
import { Commission } from '../entities/commission.entity'
import { Installment } from 'src/loans/entities/installment.entity'
import { Loan } from 'src/loans/entities/loan.entity'

@Injectable()
export class CommissionsService {
  constructor() {}

  async transactionalCreate(manager: EntityManager, createCommissionDto: CreateCommissionDto) {
    // TODO: Agregar la comisión al asesor

    const employeeId = Number(createCommissionDto.employeeId)

    await manager.insert(Commission, {
      employee: { id: employeeId },
      installment: { id: createCommissionDto.installmentId },
      interestAmount: createCommissionDto.interestAmount,
      amount: createCommissionDto.amount,
      rate: 30,
    })
    return createCommissionDto.amount
  }

  createCommissionData(employeeId: number, installmentId, interestPaid): CreateCommissionDto {
    const commissionAmount = interestPaid * 0.3
    return {
      employeeId,
      installmentId,
      interestAmount: interestPaid,
      amount: commissionAmount,
      rate: 30,
      isPaid: false,
    }
  }
}
