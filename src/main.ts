import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from 'config';
import { TransformationInterceptor } from './common/responseInterception';
import cookieParser from 'cookie-parser';

import { envs } from 'config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.use(cookieParser());

  app.setGlobalPrefix(config.get('appPrefix'));
  app.useGlobalInterceptors(new TransformationInterceptor());
  await app.listen(config.get('port'), () => {
    return console.log(`Server is running on port ${envs.port}`);
  });
}
bootstrap();
