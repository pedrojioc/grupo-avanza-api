import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '../../users/entities/user.entity'
import { Position } from './position.entity'
import { EmployeeBalance } from './employee-balance.entity'

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Position, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'position_id' })
  position: Position

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string

  @Column({ type: 'tinyint', default: 1, name: 'is_active' })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToOne(() => User, (user) => user.employee, { nullable: true })
  user: User

  @OneToOne(() => EmployeeBalance, (balance) => balance.employee)
  employeeBalance: EmployeeBalance
}
