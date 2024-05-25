import { Repository } from 'typeorm'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { FinancialActivity } from '../entities/financial-activity.entity'
import { CreateFinancialActivityDto } from '../dtos/create-financial-activity.dto'

@Injectable()
export class FinancialActivityService {
  constructor(
    @InjectRepository(FinancialActivity) private repository: Repository<FinancialActivity>,
  ) {}

  create(activity: CreateFinancialActivityDto) {
    const newActivity = this.repository.create(activity)
    return this.repository.save(newActivity)
  }

  findAll() {
    return this.repository.find()
  }

  async findOne(id: number) {
    const activity = await this.repository.findOneBy({ id })
    if (!activity) throw new NotFoundException(`Activity ID ${id} not found`)
    return activity
  }
}
