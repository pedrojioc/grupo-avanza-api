import { IsArray, IsDate, IsNotEmpty, IsNumber, IsPositive } from 'class-validator'

export class CreatePaymentDto {
  @IsPositive()
  @IsNotEmpty()
  readonly installmentId: number

  @IsPositive()
  @IsNotEmpty()
  readonly paymentMethodId: number

  @IsNumber()
  readonly capital: number

  @IsNumber()
  readonly interest: number

  @IsNumber()
  readonly total: number

  @IsArray()
  installmentIds: number[]

  @IsDate()
  @IsNotEmpty()
  readonly date: Date
}
