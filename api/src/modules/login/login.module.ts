import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
// import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: { expiresIn: config.get<number>('jwt.expiresIn', 7 * 24 * 60 * 60) },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService], //, JwtStrategy],
  exports: [LoginService, JwtModule],
})
export class LoginModule {}
