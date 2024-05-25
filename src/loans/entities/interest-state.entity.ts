import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'interest_state' })
export class InterestState {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100 })
  name: string
}
