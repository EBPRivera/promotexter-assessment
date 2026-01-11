import { Post, Body, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() authInput: LoginDto) {
    return this.authService.signIn(authInput)
  }

  @Post("signup")
  signUp(@Body() authInput: SignUpDto) {
    return this.authService.signUp(authInput)
  }
}
