/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from 'config';
import cookieParser from 'cookie-parser';
import { NextFunction, raw, Request, Response } from 'express';

import { TransformationInterceptor } from './common/responseInterception';
import csurf from 'csurf';




async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.use(cookieParser());

  // Raw body parser for webhook route
  app.use('/api/v1/orders/webhook', raw({ type: '*/*' }));

  // CSRF middleware
 

 

  app.setGlobalPrefix(config.get('appPrefix'));
  app.useGlobalInterceptors(new TransformationInterceptor());
  await app.listen(config.get('port'), () => {
    console.log(`Server is running on port ${config.get('port')}`);
  });
}
bootstrap();
