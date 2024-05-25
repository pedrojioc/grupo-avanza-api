import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RolesController } from './controllers/roles.controller'
import { RolesService } from './services/roles.service'
import { Role } from './entities/role.entity'
import { Option } from 'src/menu/entities/option.entity'
import { Menu } from 'src/menu/entities/menu.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Role, Option, Menu])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
