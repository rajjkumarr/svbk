import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import type { UserRecord } from '../users/users.service';

export type PublicUser = Omit<UserRecord, 'password'>;

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = this.usersService.findOneByEmail(dto.email);
    if (!user || user.password !== dto.password) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = this.buildPayload(user);
    const expiresIn = this.configService.get<number>('jwt.expiresIn', 7 * 24 * 60 * 60);
    const access_token = this.jwtService.sign(payload, { expiresIn });
    return {
      access_token,
      user: this.toPublicUser(user),
      expiresIn: expiresIn.toString(),
    };
  }

  async validatePayload(payload: { sub: string }): Promise<PublicUser | null> {
    try {
      return this.usersService.findOne(payload.sub);
    } catch {
      return null;
    }
  }

  private buildPayload(user: UserRecord) {
    return { sub: user.id, email: user.email, roles: [user.role] };
  }

  private toPublicUser(user: UserRecord): LoginResponseDto['user'] {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
