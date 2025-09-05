import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorator/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register user (sends OTP to email)' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'OTP sent to email' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('verify-otp')
  @Public()
  @ApiOperation({ summary: 'Verify OTP and create account' })
  @ApiBody({ type: VerifyOtpDto })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @Public()
  @ApiOperation({ summary: 'Logout (stateless JWT)' })
  logout() {
    return this.authService.logout();
  }
}
