import { IsEmail, IsString, Length } from 'class-validator';

export class EmailDto {
  @IsEmail()
  email!: string;
}

export class EmailLoginDto extends EmailDto {
  @IsString()
  @Length(6, 6)
  code!: string;
}
