import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DailyInterest } from 'src/loans/entities/daily-interest.entity'
import { Repository } from 'typeorm'
import { CreateDailyInterestDto } from './create-daily-interest.dto'

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
}
