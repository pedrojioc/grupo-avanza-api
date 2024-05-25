import { Type } from 'class-transformer'
import { IsOptional, IsPositive, IsString } from 'class-validator'

export class FilterPaginatorDto {
  @IsOptional()
  @IsString()
  filter?: string

  @IsOptional()
  @IsString()
  value?: string

  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  page?: number = 1

  @IsOptional()
  @IsPositive()
  itemsPerPage?: number = 10
}
