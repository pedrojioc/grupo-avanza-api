import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
} from '@nestjs/common'
import { Request } from 'express'

import { RolesService } from '../services/roles.service'
import { CreateRoleDto } from '../dtos/create-role.dto'
import { UpdateRoleDto } from '../dtos/update-role.dto'
import { PayloadToken } from 'src/auth/models/token.model'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto)
  }

  @Get()
  findAll() {
    return this.rolesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id)
  }

  @Get(':id/options')
  getOptions(@Req() req: Request, @Param('id') id: number) {
    const payload = req.user as PayloadToken
    if (Number(payload.role) !== Number(id)) throw new BadRequestException('Role mismatch')
    return this.rolesService.findRoleOptions(payload.role)
  }
}
