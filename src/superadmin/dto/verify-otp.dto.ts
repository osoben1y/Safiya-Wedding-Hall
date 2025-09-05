import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class VerifyOtpDto {
    @ApiProperty({ example: "123456" })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    otp: string;
}