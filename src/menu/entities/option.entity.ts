import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Menu } from './menu.entity'
import { Role } from '../../roles/entities/role.entity'

@Entity({ name: 'options' })
export class Option {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Menu, (menu) => menu.options, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 100 })
  path: string

  @Column({ type: 'varchar', length: 100 })
  icon: string

  @Column({ type: 'int', default: 0 })
  order: number

  @Column({
    name: 'is_visible',
    type: 'tinyint',
    default: 1,
    comment: 'Determina si se muestra en el menú o no',
  })
  isVisible: boolean

  @ManyToMany(() => Role, (role) => role.options)
  roles: Role[]
}
