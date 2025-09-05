import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignupAdminDto {
  @ApiProperty({
    description: 'Name of admin',
    example: 'Doston Odilov',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

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

  @ApiProperty({
    description: 'Verify password of admin',
    example: 'Admin123!',
  })
  @IsNotEmpty()
  @IsString()
  verify_password: string;
}
