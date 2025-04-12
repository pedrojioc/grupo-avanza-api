import { Controller, Get } from '@nestjs/common'
import { InstallmentTypesService } from './installment-types.service'

@Controller('installment-types')
export class InstallmentTypesController {
  constructor(private readonly installmentTypeService: InstallmentTypesService) {}

  @Get()
  findAll() {
    return this.installmentTypeService.findAll()
  }
}
