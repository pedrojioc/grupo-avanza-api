import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { LoanState } from '../entities/loan-state.entity'

@Injectable()
export class LoanStatesService {
  constructor(@InjectRepository(LoanState) private repository: Repository<LoanState>) {}

  findAll() {
    return this.repository.find()
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id })
  }
}
