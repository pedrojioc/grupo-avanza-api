import { IsNotEmpty, IsString } from 'class-validator'

export class CreateFinancialActivityDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string
}
