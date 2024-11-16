import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { NumberColumnTransformer } from 'src/shared/transformers/number-column-transformer'
import { Installment } from './installment.entity'

@Entity({ name: 'daily_interest' })
export class DailyInterest {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Installment, (installment) => installment.dailyInterest, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'installment_id' })
  installment: Installment

  @Column({ name: 'installment_id' })
  installmentId: number

  @Column({ type: 'decimal', precision: 15, scale: 2, transformer: new NumberColumnTransformer() })
  amount: number

  @Column({ type: 'date' })
  date: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
