import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { EmployeesController } from './controllers/employees.controller'
import { Employee } from './entities/employee.entity'
import { Position } from './entities/position.entity'
import { PositionsService } from './services/positions.service'
import { EmployeesService } from './services/employees.service'
import { PositionsController } from './controllers/positions.controller'
import { EmployeeBalance } from './entities/employee-balance.entity'
import { Commission } from './entities/commission.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Position, EmployeeBalance, Commission])],
  controllers: [EmployeesController, PositionsController],
  providers: [PositionsService, EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
