import { PartialType } from '@nestjs/swagger';
import { RegisterSuperadminDto } from './register-superadmin.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';

export class LoginSuperadminDto extends PartialType(RegisterSuperadminDto) {
    @ApiProperty({ example: "asadbekmmjnv@gmail.com" })
    @IsNotEmpty()
    @IsEmail({}, { message: "Please provide a valid email" })
    email: string;

    @ApiProperty({ example: "12345678" })
    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: "Password must be at least 8 characters long" })
    password: string;
}
