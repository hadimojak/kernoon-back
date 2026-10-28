import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTicketDto {
  @IsIn(['product', 'general'])
  kind!: 'product' | 'general';

  @IsString()
  @MinLength(3)
  @MaxLength(160)
  subject!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  body!: string;

  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  customerName?: string;
}

export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  body!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  senderName?: string;
}

export class UpdateTicketStatusDto {
  @IsIn(['open', 'answered', 'closed'])
  status!: 'open' | 'answered' | 'closed';
}

export class UpdateWidgetDto {
  @IsBoolean()
  enabled!: boolean;
}
