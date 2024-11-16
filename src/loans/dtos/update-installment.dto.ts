import { PartialType } from '@nestjs/mapped-types'
import { CreateInstallmentDto } from './create-installment.dto'
import { IsNumber, IsOptional, IsPositive } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateInstallmentDto extends PartialType(CreateInstallmentDto) {
  @IsPositive()
  @IsOptional()
  paymentMethodId?: number

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  customInterest?: number
}
