import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { logger } from './utils';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT;
  const grpcPort = process.env.GRPC_PORT;
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `localhost:${grpcPort}`,
      package: ['book', 'author'],
      protoPath: [
        join(__dirname, 'books/book.proto'),
        join(__dirname, 'authors/author.proto'),
      ],
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(port);

  logger.info(`gRPC    server is running on localhost:${grpcPort}`);
  logger.info(`REST    server is running on http://localhost:${port}`);
  logger.info(`GraphQL server is running on http://localhost:${port}/graphql`);
}
bootstrap();
