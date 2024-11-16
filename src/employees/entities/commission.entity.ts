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

import { Installment } from 'src/loans/entities/installment.entity'
import { Employee } from './employee.entity'

@Entity({ name: 'commissions' })
export class Commission {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Employee, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee

  @OneToOne(() => Installment, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'installment_id' })
  installment: Installment

  @Column({ name: 'interest_amount', type: 'decimal', precision: 15, scale: 2 })
  interestAmount: number

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number

  @Column({ type: 'int' })
  rate: number

  @Column({ name: 'is_paid', type: 'tinyint', default: 0 })
  isPaid: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
