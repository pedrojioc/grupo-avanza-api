import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/services/users.service'

@Injectable()
export class AuthService {
  private pendingVerifications = new Map<number, string>() // chatId, username

  constructor(private readonly userService: UsersService) {}

  async sendVerificationCode(username: string, chatId: number): Promise<boolean> {
    const user = await this.userService.findByUsername(username)
    if (!user) return false

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10) // Code valid for 10 minutes

    await this.userService.update(user.id, {
      verificationCode: code,
      verificationCodeExpires: expiresAt,
    })

    this.pendingVerifications.set(chatId, username)
    return true
  }

  async verifyCode(chatId: number, code: string): Promise<boolean> {
    const username = this.pendingVerifications.get(chatId)
    if (!username) return false

    const user = await this.userService.findByUsername(username)
    if (!user || !user.verificationCode || !user.verificationCodeExpires) return false

    const now = new Date()
    if (user.verificationCode !== code || user.verificationCodeExpires < now) return false

    await this.userService.update(user.id, {
      chatId,
      verificationCode: null,
      verificationCodeExpires: null,
    })

    this.pendingVerifications.delete(chatId)

    return true
  }

  getUserByChatId(chatId: number) {
    return this.userService.findUserByChatId(chatId)
  }
}
