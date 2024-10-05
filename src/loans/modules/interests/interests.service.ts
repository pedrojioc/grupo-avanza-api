import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'

import { Interest } from 'src/loans/entities/interest.entity'
import { INTEREST_STATE } from 'src/loans/constants/interests'
import { UpdateInterestDto } from 'src/loans/dtos/update-interest.dto'
import { CreateInterestDto } from 'src/loans/dtos/create-interest.dto'

@Injectable()
export class InterestsService {
  constructor(@InjectRepository(Interest) private repository: Repository<Interest>) {}

  async findUnpaidInterests(loanId: number) {
    const interests = await this.repository.findBy({
      loanId,
      state: Not(INTEREST_STATE.PAID),
    })
    return interests
  }

  async getInterestsAmount(interestIds: number[]) {
    if (interestIds.length === 0) return 0
    const { total } = await this.repository
      .createQueryBuilder('interest')
      .select('SUM(interest.amount)', 'total')
      .where('interest.id IN(:...ids)', { ids: interestIds })
      .andWhere('interest.interest_state_id <> :paidId', {
        paidId: INTEREST_STATE.PAID,
      })
      .getRawOne()

    return total
  }

  async rawCreate(interest: CreateInterestDto) {
    return await this.repository.insert(interest)
    // return await this.repository
    //   .createQueryBuilder()
    //   .insert()
    //   .into(Interest)
    //   .values(interest)
    //   .execute()
  }

  async rawUpdate(id: number, data: UpdateInterestDto) {
    await this.repository.update(id, data)
  }

  async getCurrentInterest(loanId: number, date: string) {
    const interest = await this.repository
      .createQueryBuilder('interest')
      .where(
        'loan_id = :loanId AND interest_state_id = :interestStateId AND deadline >= :currentDate',
        {
          loanId,
          interestStateId: INTEREST_STATE.IN_PROGRESS,
          currentDate: date,
        },
      )
      .getOne()

    return interest
  }
}
