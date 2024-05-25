import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Option } from './option.entity'

@Entity({ name: 'menus' })
export class Menu {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon: string

  @OneToMany(() => Option, (option) => option.menu)
  options: Option[]
}
