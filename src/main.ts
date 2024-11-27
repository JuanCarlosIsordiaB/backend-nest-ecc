import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove non-whitelisted properties
    forbidNonWhitelisted: true, // throw an error when non-whitelisted properties are present
    transform: true, // transform payloads to their DTO instances
  }));
  await app.listen(3000);
}
bootstrap();
