import { Injectable } from '@nestjs/common'
import { DataSource, In, Repository } from 'typeorm'

import { Interest } from '../entities/interest.entity'
import { INTEREST_STATE } from '../constants/interests'

@Injectable()
export class InterestRepository extends Repository<Interest> {
  constructor(private dataSource: DataSource) {
    super(Interest, dataSource.createEntityManager())
  }

  updateInterestsStatus(interestIds: number[], stateId: number) {
    return this.createQueryBuilder()
      .update(Interest)
      .set({ interestStateId: stateId })
      .where({ id: In(interestIds) })
      .execute()
  }

  async getInterestsAmount(interestIds: number[]) {
    const { total } = await this.createQueryBuilder('interest')
      .select('SUM(interest.amount)', 'total')
      .where('interest.id IN(:...ids)', { ids: interestIds })
      .andWhere('interest.interest_state_id = :pendingId', {
        pendingId: INTEREST_STATE.IN_PROGRESS,
      })
      .getRawOne()

    return total
  }
}
