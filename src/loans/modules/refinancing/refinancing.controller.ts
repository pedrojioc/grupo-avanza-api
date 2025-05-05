import { Body, Controller, Post } from '@nestjs/common'
import { RefinancingService } from './refinancing.service'
import { NewRefinancingDto } from './dtos/new-refinancing.dto'

@Controller('refinancing')
export class RefinancingController {
  constructor(private readonly refinancingService: RefinancingService) {}

  @Post()
  create(@Body() payload: NewRefinancingDto) {
    return this.refinancingService.create(payload)
  }
}
