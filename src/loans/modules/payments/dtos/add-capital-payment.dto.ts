import { Type } from 'class-transformer'
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator'

export class AddCapitalPaymentDto {
  @IsPositive()
  @IsNotEmpty()
  readonly loanId: number

  @IsPositive()
  @IsNotEmpty()
  readonly paymentMethodId: number

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly capital: number // ? Monto a pagar a capital

  @IsDateString({ strict: false })
  @IsOptional()
  paymentDate?: Date
}
