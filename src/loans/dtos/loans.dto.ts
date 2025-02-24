import { IsNumber, IsNotEmpty, IsDateString, IsPositive, IsOptional } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class CreateLoanDto {
  @IsPositive()
  @IsNotEmpty()
  readonly customerId: number

  @IsPositive()
  @IsNotEmpty()
  readonly employeeId: number

  @IsPositive()
  @IsNotEmpty()
  readonly paymentPeriodId: number

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number

  @IsNumber()
  @IsNotEmpty()
  readonly interestRate: number

  @IsNumber()
  @IsOptional()
  debt?: number

  @IsNumber()
  @IsNotEmpty()
  readonly installmentsNumber: number

  @IsNumber()
  @IsOptional()
  installmentsPaid?: number

  @IsNumber()
  @IsOptional()
  readonly daysLate?: number

  @IsNumber()
  @IsOptional()
  readonly currentInterest?: number

  @IsNumber()
  @IsOptional()
  readonly totalInterestPaid?: number

  @IsNumber()
  @IsOptional()
  commissionsPaid?: number

  @IsDateString({ strict: false })
  @IsNotEmpty()
  readonly startAt: Date

  @IsDateString({ strict: false })
  @IsNotEmpty()
  readonly endAt: Date

  @IsPositive()
  @IsOptional()
  paymentDay?: number

  @IsDateString()
  @IsOptional()
  readonly lastInterestPayment?: Date

  @IsPositive()
  @IsNotEmpty()
  loanStateId: number
}

export class UpdateLoanDto extends PartialType(CreateLoanDto) {
  @IsDateString({ strict: false })
  @IsOptional()
  lastNotificationSent?: Date
}
