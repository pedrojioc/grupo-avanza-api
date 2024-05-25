import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { CreateEmployeeDto } from '../dtos/create-employee.dto'
import { EmployeesService } from '../services/employees.service'
import { Public } from 'src/auth/decorators/public.decorator'
import { FilterEmployeesDto } from '../dtos/filter-employees.dto'

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeeService: EmployeesService) {}

  @Post()
  create(@Body() payload: CreateEmployeeDto) {
    return this.employeeService.create(payload)
  }

  @Get()
  findAll(@Query() params: FilterEmployeesDto) {
    return this.employeeService.findAll(params)
  }
}
