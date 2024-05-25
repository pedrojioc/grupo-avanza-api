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
  @IsOptional()
  debt: number

  @IsNumber()
  capital: number

  @IsNumber()
  interest: number

  @IsNumber()
  total: number

  @IsArray()
  readonly interestIds: number[]
}
