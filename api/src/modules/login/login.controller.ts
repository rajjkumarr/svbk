import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @Public()
  @UsePipes(ValidationPipe)
  async login(@Body() loginDto: LoginDto) {
    return this.loginService.login(loginDto);
  }
}
