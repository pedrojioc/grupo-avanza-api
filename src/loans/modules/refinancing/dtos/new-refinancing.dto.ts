import { OmitType } from '@nestjs/mapped-types'
import { IsDateString, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator'
import { CreateLoanDto } from 'src/loans/dtos/loans.dto'

export class NewRefinancingDto extends OmitType(CreateLoanDto, ['customerId'] as const) {
  @IsPositive()
  @IsNotEmpty()
  originLoanId: number

  @IsDateString({ strict: false })
  @IsNotEmpty()
  readonly refinancingDate: Date

  @IsOptional()
  @IsString()
  readonly note?: string
}
