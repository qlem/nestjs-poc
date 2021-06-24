import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const grpcPort = 5000;
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

  const port = 3000;
  await app.startAllMicroservicesAsync();
  await app.listen(port);

  console.log(`gRPC    server is running on localhost:${grpcPort}`);
  console.log(`REST    server is running on http://localhost:${port}`);
  console.log(`GraphQL server is running on http://localhost:${port}/graphql`);
}
bootstrap();
