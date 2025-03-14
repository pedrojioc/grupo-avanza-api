import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsPositive } from 'class-validator'
import { FilterPaginatorDto } from 'src/lib/filter-paginator/dtos/filter-paginator.dto'

export class FilterPaymentsDto extends FilterPaginatorDto {
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  employeeId?: number

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  isReceived: boolean
}
