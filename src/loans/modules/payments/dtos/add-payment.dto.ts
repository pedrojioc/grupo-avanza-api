import { Type } from 'class-transformer'
import { IsArray, IsNumber, IsOptional, IsPositive } from 'class-validator'

export class AddPaymentDto {
  @IsPositive()
  loanId: number

  @IsPositive()
  paymentMethodId: number

  @IsPositive()
  @IsOptional()
  installmentStateId: number

  @IsNumber()
  @Type(() => Number)
  capital: number // ? Monto a pagar a capital

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  customInterest?: number // ? Monto a pagar por intereses, si es un monto diferente al del sistema

  @IsArray()
  @IsOptional()
  readonly interestIds: number[]
}
