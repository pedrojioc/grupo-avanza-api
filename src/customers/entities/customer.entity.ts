import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { FinancialActivity } from './financial-activity.entity'

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn()
  id: number

  @Generated('uuid')
  uuid: string

  @ManyToOne(() => FinancialActivity)
  @JoinColumn({ name: 'financial_activity_id' })
  financialActivity: FinancialActivity

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 20, name: 'id_number' })
  idNumber: string

  @Column({ type: 'varchar', length: 50 })
  address: string

  @Column({ type: 'varchar', length: 50, name: 'phone_number' })
  phoneNumber: string

  @Column({ type: 'date' })
  birthdate: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
