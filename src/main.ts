import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';
import grpcOptions from './grpcClient.options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(grpcOptions);

  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}
bootstrap();
