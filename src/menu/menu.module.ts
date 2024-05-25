import { Module } from '@nestjs/common'
import { OptionsService } from './services/options.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Menu } from './entities/menu.entity'
import { Option } from './entities/option.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Option])],
  providers: [OptionsService],
})
export class MenuModule {}
