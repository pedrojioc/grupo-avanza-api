import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Position } from '../entities/position.entity'
import { Repository } from 'typeorm'
import { CreatePositionDto } from '../dtos/create-position.dto'

@Injectable()
export class PositionsService {
  constructor(@InjectRepository(Position) private repository: Repository<Position>) {}

  create(payload: CreatePositionDto) {
    const newPosition = this.repository.create(payload)
    return this.repository.save(newPosition)
  }

  findAll() {
    return this.repository.find()
  }

  async findOne(id: number) {
    const position = await this.repository.findOneBy({ id })
    if (!position) throw new NotFoundException(`Position ${id} not found`)
    return position
  }
}
