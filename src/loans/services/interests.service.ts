import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'

import { Interest } from '../entities/interest.entity'
import { CreateInterestDto } from '../dtos/create-interest.dto'
import { UpdateInterestDto } from '../dtos/update-interest.dto'
import { FilterPaginator } from 'src/lib/filter-paginator'
import { LoansService } from './loans.service'
import { FilterPaginatorDto } from 'src/lib/filter-paginator/dtos/filter-paginator.dto'
import { InterestState } from '../entities/interest-state.entity'

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest) private repository: Repository<Interest>,
    private loanService: LoansService,
  ) {}

  async rawCreate(interest: CreateInterestDto) {
    return await this.repository
      .createQueryBuilder()
      .insert()
      .into(Interest)
      .values(interest)
      .execute()
  }

  findAllByLoan(loanId: number, params: FilterPaginatorDto) {
    const whereOptions: FindOptionsWhere<Interest> = {}

    if (params.state) {
      const interestState = { id: params.state } as InterestState
      whereOptions.state = interestState
    }

    const paginator = new FilterPaginator(this.repository, {
      where: { loanId, ...whereOptions },
      relations: ['state'],
    })
    const result = paginator.paginate(1).execute()
    return result
  }

  async update(id: number, data: UpdateInterestDto) {}

  async rawUpdate(id: number, data: UpdateInterestDto) {
    await this.repository.createQueryBuilder().update(Interest).set(data).where({ id }).execute()
  }
}
