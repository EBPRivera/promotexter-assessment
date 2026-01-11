import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { hash, genSalt, compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(loginInput: LoginDto): Promise<{ access_token }> {
    const { username, password } = loginInput
    const user = await this.usersService.findByUsername(username)

    // Compare password
    const passwordCheckResult = await compare(password, user.password)
    if (!passwordCheckResult) {
      throw new UnauthorizedException("Password is incorrect")
    }

    // Generate access token
    const payload = { sub: user.id, username: user.username }
    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }

  async signUp(userInput: SignUpDto): Promise<void> {
    const { username, password, confirmPassword } = userInput

    // Verify password
    if (password != confirmPassword) {
      throw new BadRequestException("Password and confirm password does not match")
    }

    this.usersService.create({ username, password })
  }
}
