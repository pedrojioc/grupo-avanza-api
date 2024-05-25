import { IsOptional, IsPositive, IsString } from 'class-validator'

export class FilterLoansDto {
  @IsOptional()
  @IsString()
  filter?: string

  @IsOptional()
  @IsString()
  value?: string

  @IsOptional()
  @IsPositive()
  page?: number = 1

  @IsOptional()
  @IsPositive()
  showing?: number = 10
}
