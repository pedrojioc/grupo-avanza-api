import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { IsDate, IsNumber, IsNumberString } from 'class-validator'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  chatId?: number

  @IsNumberString()
  verificationCode?: string

  @IsDate()
  verificationCodeExpires?: Date
}
