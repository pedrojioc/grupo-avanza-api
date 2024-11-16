import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Loan } from './loan.entity'
import { PaymentMethod } from '../../payment-methods/entities/payment-method.entity'
import { InstallmentState } from './installment-state.entity'
import { Commission } from 'src/employees/entities/commission.entity'
import { DailyInterest } from './daily-interest.entity'
import { NumberColumnTransformer } from 'src/shared/transformers/number-column-transformer'

@Entity({ name: 'installments' })
export class Installment {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Loan, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'loan_id' })
  loan: Loan
  @Column({ name: 'loan_id' })
  loanId: number

  @ManyToOne(() => PaymentMethod, { nullable: true, onDelete: 'RESTRICT' })
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

  @Column({ name: 'starts_on', type: 'date', nullable: true })
  startsOn: Date

  @Column({ name: 'payment_deadline', type: 'date', nullable: true })
  paymentDeadline: Date

  @Column({ type: 'int', default: 0 })
  days: number

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
    comment: 'Abono que se hace a la deuda capital',
  })
  capital: number

  @Column({ type: 'decimal', precision: 15, scale: 2, transformer: new NumberColumnTransformer() })
  interest: number

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => DailyInterest, (dailyInterest) => dailyInterest.installment)
  dailyInterest: DailyInterest[]
}
