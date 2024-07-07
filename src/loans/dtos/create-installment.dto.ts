import { Type } from 'class-transformer'
import { IsArray, IsNumber, IsOptional, IsPositive } from 'class-validator'

export class CreateInstallmentDto {
  @IsPositive()
  loanId: number

  @IsPositive()
  paymentMethodId: number

  @IsPositive()
  @IsOptional()
  installmentStateId: number

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  debt: number

  @IsNumber()
  @Type(() => Number)
  capital: number

  @IsNumber()
  @Type(() => Number)
  interest: number

  @IsNumber()
  @Type(() => Number)
  total: number

  @IsArray()
  readonly interestIds: number[]
}
