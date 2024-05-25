import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/services/users.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/users/entities/user.entity'
import { PayloadToken } from '../models/token.model'

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username)
    const isMatch = await bcrypt.compare(password, user.password)
    if (user && isMatch) return user

    return null
  }

  generateJWT(user: User) {
    const payload: PayloadToken = { role: user.role.id, sub: user.id, username: user.username }
    return {
      access_token: this.jwtService.sign(payload),
      user,
    }
  }

  getUser(userId: number) {
    return this.userService.findOne(userId)
  }
}
