import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'

import { Employee } from '../entities/employee.entity'
import { CreateEmployeeDto } from '../dtos/create-employee.dto'
import { PositionsService } from './positions.service'
import { FilterEmployeesDto } from '../dtos/filter-employees.dto'

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee) private repository: Repository<Employee>,
    private positionsService: PositionsService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const newEmployee = this.repository.create(createEmployeeDto)
    const position = await this.positionsService.findOne(createEmployeeDto.positionId)
    newEmployee.position = position
    return this.repository.save(newEmployee)
  }
  findAll(params: FilterEmployeesDto) {
    let queryOptions = {}
    if (params.searchBy)
      queryOptions = { where: { [params.searchBy]: Like(`${params.searchValue}%`) } }
    if (params.offset) queryOptions = { ...queryOptions, offset: params.offset }

    return this.repository.find({
      order: { id: 'DESC' },
      take: params.limit ? params.limit : 10,
    })
  }
  async findOne(id: number) {
    const employee = await this.repository.findOneBy({ id })
    if (!employee) throw new NotFoundException(`Employee ${id} not found`)
    return employee
  }
}
