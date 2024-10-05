import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from 'src/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configServices: ConfigType<typeof config>) => {
        const { host, port, username, password, database } = configServices.mysql

        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          synchronize: false,
          autoLoadEntities: true,
        }
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
