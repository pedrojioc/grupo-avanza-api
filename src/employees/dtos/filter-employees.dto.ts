import { IsOptional, IsPositive, Min } from 'class-validator'

export class FilterEmployeesDto {
  @IsOptional()
  @IsPositive()
  limit?: number

  @IsOptional()
  @Min(0)
  offset?: number

  @IsOptional()
  searchBy?: string

  @IsOptional()
  searchValue?: string
}
