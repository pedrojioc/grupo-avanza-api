import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'payment_methods' })
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string

  @Column({ type: 'varchar', length: 300, nullable: true })
  description: string
}
