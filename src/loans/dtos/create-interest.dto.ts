import { IsDate, IsDateString, IsNumber, IsPositive } from 'class-validator'

export class CreateInterestDto {
  @IsNumber()
  amount: number

  @IsNumber()
  capital: number

  @IsDateString()
  readonly startAt: Date

  @IsDate()
  deadline: Date

  @IsNumber()
  days: number

  @IsPositive()
  loanId: number

  @IsPositive()
  interestStateId: number
  @IsDate()
  lastInterestGenerated: Date
}
