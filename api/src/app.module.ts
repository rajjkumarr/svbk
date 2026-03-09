import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { HealthModule } from './modules/health/health.module';
import { LoginModule } from './modules/login/login.module';
import { UsersModule } from './modules/users/users.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ValidationPipe } from './common/pipes/validation.pipe';

@Module({
  imports: [ConfigModule, HealthModule, LoginModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule {}
