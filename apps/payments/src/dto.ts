import { IsIn, IsInt, IsString, Min, MinLength } from 'class-validator';
import { paymentGateways, PaymentGateway } from '@app/contracts';

export class ChargeDto {
  @IsString()
  @MinLength(1)
  orderId!: string;

  @IsInt()
  @Min(1000)
  amountToman!: number;

  @IsIn(paymentGateways)
  gateway!: PaymentGateway;
}
