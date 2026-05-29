import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { EnvService } from './config/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });
  const env = app.get(EnvService);

  await app.listen(env.port);

  console.log(`[api] listening on http://localhost:${env.port}`);
}

bootstrap();
