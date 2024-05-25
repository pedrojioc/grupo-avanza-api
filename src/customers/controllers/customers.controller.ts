import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { CustomersService } from '../services/customers.service'
import { CreateCustomerDto } from '../dtos/create-customer.dto'
import { UpdateCustomerDto } from '../dtos/update-customer.dto'
import { FilterPaginatorDto } from 'src/lib/filter-paginator/dtos/filter-paginator.dto'

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto)
  }

  @Get()
  findAll(@Query() params: FilterPaginatorDto) {
    return this.customersService.findAll(params)
  }

  @Get('filter')
  filter(@Query('name') name: string) {
    return this.customersService.findByIdName(name)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id)
  }
}
