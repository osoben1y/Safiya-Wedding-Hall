import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 4, maxLength: 6 })
  @IsNotEmpty()
  @Length(4, 6)
  code: string;
}
