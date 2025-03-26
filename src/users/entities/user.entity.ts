import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Employee } from '../../employees/entities/employee.entity'
import { Role } from '../../roles/entities/role.entity'
import { Exclude } from 'class-transformer'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => Employee, (employee) => employee.user, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee

  @ManyToOne(() => Role, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'role_id' })
  role: Role

  @Column({ name: 'role_id' })
  roleId: number

  @Column({ type: 'varchar', length: 50, nullable: false })
  username: string

  @Exclude()
  @Column()
  password: string

  @Exclude()
  @Column({ type: 'int', nullable: true })
  chatId?: number

  @Exclude()
  @Column({ name: 'verification_code', type: 'varchar', nullable: true })
  verificationCode?: string

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  verificationCodeExpires?: Date

  @Exclude()
  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refreshToken?: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
