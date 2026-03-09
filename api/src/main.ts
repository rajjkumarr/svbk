import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('port', 3000);
  const prefix = config.get<string>('api.prefix', 'api');
  app.setGlobalPrefix(prefix);
  await app.listen(port);
}
bootstrap();
