import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { FilterPaginatorDto } from 'src/lib/filter-paginator/dtos/filter-paginator.dto'

export class FilterLoansDto extends FilterPaginatorDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  interestState?: Number

  @IsString()
  @IsOptional()
  client?: string
}
