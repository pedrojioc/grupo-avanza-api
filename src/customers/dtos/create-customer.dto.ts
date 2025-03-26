import { IsDateString, IsNotEmpty, IsNumberString, IsPositive, IsString } from 'class-validator'

export class CreateCustomerDto {
  @IsPositive()
  @IsNotEmpty()
  financialActivityId: number

  @IsString()
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @IsNumberString()
  idNumber: string

  @IsString()
  @IsNotEmpty()
  address: string

  @IsNumberString()
  phoneNumber: string

  @IsDateString({ strict: false, strictSeparator: false })
  @IsNotEmpty()
  birthdate: Date
}
