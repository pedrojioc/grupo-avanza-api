import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { Installment } from '../entities/installment.entity'
import { CreateInstallmentDto } from '../dtos/create-installment.dto'
import { Interest } from '../entities/interest.entity'

@Injectable()
export class InstallmentsService {
  INTEREST_STATES = {
    PENDING: 1,
    PAID: 2,
  }
  INSTALLMENT_STATES = {
    PENDING: 1,
    PAID: 2,
  }
  constructor(
    @InjectRepository(Installment) private repository: Repository<Installment>,
    @InjectRepository(Interest) private interestRepository: Repository<Interest>,
  ) {}

  async updateToPaidStatus(interestsId: number[]) {
    console.log(interestsId)
    return this.interestRepository
      .createQueryBuilder()
      .update(Interest)
      .set({ interestStateId: this.INTEREST_STATES.PAID })
      .where({ id: In(interestsId) })
      .execute()
  }

  async getInterestsAmount(interestIds: number[]) {
    console.log(interestIds)
    const { total } = await this.interestRepository
      .createQueryBuilder('interest')
      .select('SUM(interest.amount)', 'total')
      .where('interest.id IN(:...ids)', { ids: interestIds })
      .andWhere('interest.interest_state_id = :pendingId', {
        pendingId: this.INTEREST_STATES.PENDING,
      })
      .getRawOne()

    return total
  }

  async create(data: CreateInstallmentDto) {
    const interestAmount = await this.getInterestsAmount(data.interestIds)
    console.log(interestAmount, data.interest)
    if (Number(interestAmount) !== data.interest)
      throw new BadRequestException('El monto del interest no coincide')

    data.installmentStateId = this.INSTALLMENT_STATES.PAID
    const result = await this.repository
      .createQueryBuilder()
      .insert()
      .into(Installment)
      .values(data)
      .execute()

    const installmentId = result.raw.insertId

    await this.repository
      .createQueryBuilder()
      .relation(Installment, 'interests')
      .of(installmentId)
      .add(data.interestIds)

    await this.updateToPaidStatus(data.interestIds)

    return installmentId
  }
}
