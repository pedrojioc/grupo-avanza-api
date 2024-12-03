import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DailyInterest } from 'src/loans/entities/daily-interest.entity'
import { FindOptionsWhere, Repository } from 'typeorm'
import { CreateDailyInterestDto } from './create-daily-interest.dto'
import { FilterPaginator } from 'src/lib/filter-paginator'
import { FilterPaginatorDto } from 'src/lib/filter-paginator/dtos/filter-paginator.dto'

@Injectable()
export class DailyInterestService {
  constructor(@InjectRepository(DailyInterest) private repository: Repository<DailyInterest>) {}

  create(data: CreateDailyInterestDto) {
    const daily = this.repository.create(data)
    return this.repository.save(daily)
  }

  findOneByDate(installmentId: number, date: Date) {
    return this.repository.findOne({ where: { installmentId, date } })
  }

  findAllByInstallment(installmentId: number, params: FilterPaginatorDto) {
    const whereOptions: FindOptionsWhere<DailyInterest> = {}

    const paginator = new FilterPaginator(this.repository, {
      where: { installmentId, ...whereOptions },
    })
    const result = paginator.paginate(params.page).execute()
    return result
  }
}
