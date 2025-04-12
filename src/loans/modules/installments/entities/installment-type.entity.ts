import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'installments_types' })
export class InstallmentType {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'char', length: 100 })
  name: string

  @Column({ type: 'varchar', nullable: true })
  description: string
}
