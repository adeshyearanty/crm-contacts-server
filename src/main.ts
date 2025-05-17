/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'], // Reduce logging in production
    bodyParser: true,
    cors: true,
  });

  // Enable security middleware
  app.use(helmet());
  app.use(compression()); // Enable compression
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Enable validation pipe with strict settings
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Apply global response transform
  app.useGlobalInterceptors(new TransformInterceptor());

  // Configure Swagger only in development
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Contact Management API')
      .setDescription('API documentation for the Contact Management System')
      .setVersion('1.0')
      .addTag('contacts')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(
      `Swagger documentation is available at: http://localhost:${port}/api`,
    );
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

void bootstrap();
