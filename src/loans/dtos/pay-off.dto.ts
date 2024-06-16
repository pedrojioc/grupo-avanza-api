import { IsOptional, IsPositive } from 'class-validator'

export class PayOffDto {
  @IsPositive()
  loanId: number

  @IsPositive()
  @IsOptional()
  amount: number

  @IsPositive()
  paymentMethodId: number
}
