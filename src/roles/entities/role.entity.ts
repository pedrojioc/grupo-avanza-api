import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'

import { Option } from '../../menu/entities/option.entity'

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToMany(() => Option, (option) => option.roles)
  @JoinTable({
    name: 'roles_options',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'option_id' },
  })
  options: Option[]
}
