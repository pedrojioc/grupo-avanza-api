import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'financial_activities' })
export class FinancialActivity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
