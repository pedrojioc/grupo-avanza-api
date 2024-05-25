import { Body, Controller, Get, Post } from '@nestjs/common'
import { PositionsService } from '../services/positions.service'
import { CreatePositionDto } from '../dtos/create-position.dto'

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionService: PositionsService) {}

  @Post()
  create(@Body() positionPayload: CreatePositionDto) {
    return this.positionService.create(positionPayload)
  }

  @Get()
  getAll() {
    return this.positionService.findAll()
  }
}
