import { IsNotEmpty, IsPositive, IsString } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsPositive()
  readonly employeeId: number

  @IsNotEmpty()
  @IsPositive()
  readonly roleId: number

  @IsString()
  @IsNotEmpty()
  readonly username: string

  @IsString()
  @IsNotEmpty()
  readonly password: string
}
