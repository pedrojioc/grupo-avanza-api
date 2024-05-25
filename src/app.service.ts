import { Injectable, Inject } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import config from './config'

@Injectable()
export class AppService {
  constructor(
    @Inject(config.KEY) private configServices: ConfigType<typeof config>,
  ) {}
  getHello(): string {
    return 'Hello World!'
  }
}
