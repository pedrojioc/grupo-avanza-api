import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UsersController } from './controllers/users.controller'
import { UsersService } from './services/users.service'
import { User } from './entities/user.entity'
import { EmployeesModule } from 'src/employees/employees.module'
import { RolesModule } from 'src/roles/roles.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmployeesModule, RolesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
