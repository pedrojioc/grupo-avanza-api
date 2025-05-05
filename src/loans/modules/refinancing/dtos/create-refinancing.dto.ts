import { IsDate, IsDateString, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator'

export class CreateRefinancingDto {
  @IsPositive()
  @IsNotEmpty()
  readonly originLoanId: number

  @IsPositive()
  @IsNotEmpty()
  newLoanId: number

  @IsPositive()
  @IsNotEmpty()
  previousAmount: number

  @IsPositive()
  @IsNotEmpty()
  newAmount: number

  @IsDateString({ strict: false })
  @IsNotEmpty()
  readonly refinancingDate: Date

  @IsOptional()
  @IsString()
  readonly note?: string
}
