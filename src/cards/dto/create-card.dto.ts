import { IsNotEmpty, IsString, IsBoolean, IsIn } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  cardHolder: string;

  @IsNotEmpty()
  @IsString()
  securityCode: string;

  @IsNotEmpty()
  @IsString()
  expiration: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  isVirtual: boolean;

  @IsNotEmpty()
  @IsString()
  @IsIn(['credit', 'debit', 'both'])
  type: string;
}
