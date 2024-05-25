import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { AuthService } from '../services/auth.service'
import { User } from 'src/users/entities/user.entity'
import { Public } from '../decorators/public.decorator'
import { PayloadToken } from '../models/token.model'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User
    return this.authService.generateJWT(user)
  }

  @Get('user')
  async getUser(@Req() req: Request) {
    const payload = req.user as PayloadToken
    const user = await this.authService.getUser(payload.sub)
    return user
  }
}
