import { IsDate, IsPositive } from 'class-validator'

export class CreateDailyInterestDto {
  @IsPositive()
  installmentId: number

  @IsPositive()
  amount: number

  @IsDate()
  date: Date
}
