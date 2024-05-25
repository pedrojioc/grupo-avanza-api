import { Injectable, NotFoundException } from '@nestjs/common'
import { In, Repository } from 'typeorm'

import { CreateRoleDto } from '../dtos/create-role.dto'
import { UpdateRoleDto } from '../dtos/update-role.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Role } from '../entities/role.entity'
import { Option } from 'src/menu/entities/option.entity'
import { Menu } from 'src/menu/entities/menu.entity'

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private repository: Repository<Role>,
    @InjectRepository(Option) private optionRepository: Repository<Option>,
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
  ) {}

  async create(role: CreateRoleDto) {
    const newRole = this.repository.create(role)
    if (role.optionsId) {
      const options = await this.optionRepository.findBy({ id: In(role.optionsId) })
      newRole.options = options
    }
    return this.repository.save(newRole)
  }

  findAll() {
    return this.repository.find()
  }

  async findOne(id: number) {
    const role = await this.repository.findOneBy({ id })
    if (!role) throw new NotFoundException(`Role ID ${id} not found`)
    return role
  }

  async update(id: number, data: UpdateRoleDto) {
    const role = await this.findOne(id)
    this.repository.merge(role, data)
    return this.repository.save(role)
  }

  remove(id: number) {
    return `This action removes a #${id} role`
  }

  findRoleOptions(id: number) {
    const menu = this.menuRepository
      .createQueryBuilder('menu')
      .innerJoinAndSelect('menu.options', 'option')
      .innerJoin('roles_options', 'ro', 'option.id = ro.option_id')
      .innerJoin('roles', 'role', 'ro.role_id = role.id')
      .where('ro.role_id = :id', { id })
      .getMany()
    return menu
  }
}
