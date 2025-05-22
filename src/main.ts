import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { secureHeaders } from './common/middleware/secure-headers.middleware';

const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Amzn-Remapped-Authorization',
    'Refresh_Token',
    'X-Personal-API-Key',
  ],
  exposedHeaders: [
    'Authorization',
    'X-Amzn-Remapped-Authorization',
    'Refresh_Token',
    'X-Personal-API-Key',
  ],
  maxAge: 1800,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(secureHeaders);
  app.enableCors(corsOptions);
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.use(
    rateLimit({
      windowMs: 60_000,
      max: 60,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
