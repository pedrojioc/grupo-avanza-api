import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class WhatsAppForDelayDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  readonly days_late: number

  @IsNotEmpty()
  readonly pending_amount: string

  @IsString()
  @IsNotEmpty()
  readonly phone: string
}
