import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Match } from "src/common/decorator/match.decorator";

export class RegisterSuperadminDto {
  @ApiProperty({ example: "Asadbek" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: "asadbekmmjnv@gmail.com" })
  @IsNotEmpty()
  @IsEmail({}, { message: "Please provide a valid email" })
  email: string;

  @ApiProperty({ example: "12345678" })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password: string;

  @ApiProperty({ description: "Parolingizni tasdiqlang", example: "12345678" })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: "Verify password must be at least 8 characters long" })
  @Match("password", { message: "Passwords do not match" })
  verifyPassword: string;
}
