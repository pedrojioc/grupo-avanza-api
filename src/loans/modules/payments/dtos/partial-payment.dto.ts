import { Type } from 'class-transformer'
import { IsPositive } from 'class-validator'

export class PartialPaymentDto {
  @IsPositive()
  readonly installmentId: number

  @IsPositive()
  @Type(() => Number)
  readonly amount: number
}
