import { IsBoolean, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator'

export class CreateEmployeeDto {
  @IsPositive()
  @IsNotEmpty()
  readonly positionId: number

  @IsString()
  @IsNotEmpty()
  readonly name: string

  @IsBoolean()
  @IsOptional()
  readonly isActive: boolean
}
