import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { AuthJwtPayload } from '../types/token.model'
import jwtConfig from '../config/jwt.config'
import { AuthService } from '../services/auth.service'
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY) private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret,
      ignoreExpiration: false,
    })
  }

  validate(payload: AuthJwtPayload) {
    const userId = payload.sub
    return this.authService.validateJwtUser(userId)
  }
}
