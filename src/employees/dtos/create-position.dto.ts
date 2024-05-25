import { IsNotEmpty, IsString } from 'class-validator'

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string
}
