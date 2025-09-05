import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninAdminDto {
  @ApiProperty({
    description: 'Email of admin',
    example: 'admin@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Password of admin',
    example: 'Admin123!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
