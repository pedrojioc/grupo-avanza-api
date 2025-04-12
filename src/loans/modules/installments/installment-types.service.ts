import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InstallmentType } from './entities/installment-type.entity'
import { Repository } from 'typeorm'

@Injectable()
export class InstallmentTypesService {
  constructor(
    @InjectRepository(InstallmentType) private readonly repository: Repository<InstallmentType>,
  ) {}

  findAll() {
    return this.repository.find()
  }
}
