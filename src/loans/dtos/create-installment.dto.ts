import { Type } from 'class-transformer'
import { IsDate, IsNumber, IsOptional, IsPositive } from 'class-validator'

export class CreateInstallmentDto {
  @IsPositive()
  loanId: number

  @IsPositive()
  @IsOptional()
  installmentStateId: number

  @IsNumber()
  @Type(() => Number)
  debt: number

  @IsDate()
  startsOn: Date

  @IsDate()
  paymentDeadline: Date

  @IsNumber()
  days: number

  @IsNumber()
  @Type(() => Number)
  capital: number

  @IsNumber()
  @Type(() => Number)
  interest: number

  @IsNumber()
  @Type(() => Number)
  total: number
}
