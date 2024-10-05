import { EmployeeBalance } from 'src/employees/entities/employee-balance.entity'
import { Employee } from 'src/employees/entities/employee.entity'
import { Position } from 'src/employees/entities/position.entity'
import { User } from 'src/users/entities/user.entity'

export const mockEmployee: Employee = {
  id: 0,
  position: new Position(),
  name: '',
  isActive: false,
  createdAt: undefined,
  updatedAt: undefined,
  user: new User(),
  employeeBalance: new EmployeeBalance(),
}
