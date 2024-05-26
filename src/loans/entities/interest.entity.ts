import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Loan } from './loan.entity'
import { InterestState } from './interest-state.entity'
import { Installment } from './installment.entity'

@Entity({ name: 'interests' })
export class Interest {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Loan, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'loan_id' })
  loan: Loan

  @Column({ name: 'loan_id' })
  loanId: number

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  capital: number

  @Column({ name: 'start_at', type: 'date' })
  startAt: Date

  @Column({ name: 'deadline', type: 'date' })
  deadline: Date

  @Column({ type: 'int' })
  days: number

  @ManyToOne(() => InterestState, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'interest_state_id' })
  state: InterestState
  @Column({ name: 'interest_state_id' })
  interestStateId: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToMany(() => Installment, (installment) => installment.interests)
  installments: Installment[]
}
