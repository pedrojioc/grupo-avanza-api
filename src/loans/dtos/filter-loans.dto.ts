import { Type } from 'class-transformer'
import { IsOptional, IsPositive, IsString } from 'class-validator'
import { FilterPaginatorDto } from 'src/lib/filter-paginator/dtos/filter-paginator.dto'

export class FilterLoansDto extends FilterPaginatorDto {}
