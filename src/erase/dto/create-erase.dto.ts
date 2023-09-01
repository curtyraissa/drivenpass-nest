import { IsNotEmpty, IsString } from 'class-validator';

export class EraseAccountDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}

