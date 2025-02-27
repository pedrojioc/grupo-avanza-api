import { Type } from 'class-transformer'
import { IsDateString, IsNumber, IsOptional, IsPositive } from 'class-validator'

export class AddPaymentDto {
  @IsPositive()
  loanId: number

  @IsPositive()
  paymentMethodId: number

  @IsNumber()
  @Type(() => Number)
  capital: number // ? Monto a pagar a capital

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  customInterest?: number // ? Monto a pagar por intereses, si es un monto diferente al del sistema

  @IsPositive()
  readonly installmentId: number

  @IsDateString({ strict: false })
  @IsOptional()
  paymentDate?: Date
}
