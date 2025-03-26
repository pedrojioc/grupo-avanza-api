import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'

import { AuthJwtPayload } from '../types/token.model'
import refreshJwtConfig from '../config/refresh-jwt.config'
import { AuthService } from '../services/auth.service'
@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request.cookies?.Refresh]),
      secretOrKey: refreshJwtConfiguration.secret,
      ignoreExpiration: false,
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: AuthJwtPayload) {
    const refreshToken = req.cookies?.Refresh
    const userId = payload.sub
    return this.authService.validateRefreshToken(userId, refreshToken)
  }
}
