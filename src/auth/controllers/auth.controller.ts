import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'

import { AuthService } from '../services/auth.service'
import { Public } from '../decorators/public.decorator'
import { AuthJwtPayload } from '../types/token.model'
import { RefreshAuthGuard } from '../guards/refresh-auth.guard'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as AuthJwtPayload
    const { accessToken, refreshToken } = await this.authService.login(user)

    res.cookie('Refresh', refreshToken, this.authService.cookieSetup())
    return { accessToken }
  }

  @Get('user')
  async getUser(@Req() req: Request) {
    const payload = req.user as AuthJwtPayload
    const user = await this.authService.getUser(payload.sub)
    return user
  }

  @Get('status')
  async status() {
    return { status: 'ok' }
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const payload = req.user as AuthJwtPayload
    const { accessToken, refreshToken } = await this.authService.refreshToken(payload)
    res.cookie('Refresh', refreshToken, this.authService.cookieSetup())
    return { accessToken }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const payload = req.user as AuthJwtPayload
    await this.authService.logout(payload.sub)

    res.cookie('Refresh', '', { expires: new Date(0) })
    res.clearCookie('Refresh')
    return { message: 'Logout success' }
  }
}
