import {
  RequestMethod,
  Type,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

export const API_VERSION = '1';

export async function bootstrap(
  module: Type<unknown>,
  options: {
    name: string;
    defaultPort: number;
    cors?: boolean;
    prefix?: string;
  },
) {
  const app = await NestFactory.create(module, {
    logger: ['error', 'warn'],
  });
  app.enableShutdownHooks();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_VERSION,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (options.cors) {
    const origin = (process.env.CORS_ORIGIN ?? 'http://localhost:5000')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    app.enableCors({ origin, credentials: true });
  }

  if (options.prefix) {
    app.setGlobalPrefix(options.prefix, {
      exclude: [{ path: 'health', method: RequestMethod.GET }],
    });
  }

  const port = Number(process.env.PORT ?? options.defaultPort);
  await app.listen(port, '0.0.0.0');
  console.log(await app.getUrl());
}
