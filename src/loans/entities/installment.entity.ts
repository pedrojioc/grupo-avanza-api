import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Loan } from './loan.entity'
import { PaymentMethod } from '../../payment-methods/entities/payment-method.entity'
import { InstallmentState } from './installment-state.entity'
import { Interest } from './interest.entity'

@Entity({ name: 'installments' })
export class Installment {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Loan, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'loan_id' })
  loan: Loan
  @Column({ name: 'loan_id' })
  loanId: number

  @ManyToOne(() => PaymentMethod, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod
  @Column({ name: 'payment_method_id' })
  paymentMethodId: number

  @ManyToOne(() => InstallmentState, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'installment_state_id' })
  installmentState: InstallmentState
  @Column({ name: 'installment_state_id' })
  installmentStateId: number

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  debt: number

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    comment: 'Abono que se hace a la deuda capital',
  })
  capital: number

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  interest: number

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToMany(() => Interest, (interest) => interest.installments)
  @JoinTable({
    name: 'installments_interests',
    joinColumn: { name: 'installment_id' },
    inverseJoinColumn: { name: 'interest_id' },
  })
  interests: Interest[]
}
