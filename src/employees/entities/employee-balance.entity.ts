import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Employee } from './employee.entity'

@Entity({ name: 'employee_balances' })
export class EmployeeBalance {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => Employee, (employee) => employee.employeeBalance, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee

  @Column({ name: 'employee_id' })
  employeeId: number

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number

  @Column({ name: 'total_paid', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalPaid: number

  @Column({ name: 'commissions_paid', type: 'int', default: 0 })
  commissionsPaid: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
