import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaymentMethod } from '../entities/payment-method.entity'
import { Repository } from 'typeorm'

@Injectable()
export class PaymentMethodsService {
  constructor(@InjectRepository(PaymentMethod) private repository: Repository<PaymentMethod>) {}

  findAll() {
    return this.repository.find()
  }
}
