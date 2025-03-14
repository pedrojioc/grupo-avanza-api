import { IsArray, IsNotEmpty } from 'class-validator'

export class MarkPaymentAsReceived {
  @IsNotEmpty()
  @IsArray()
  paymentIds: number[]
}
