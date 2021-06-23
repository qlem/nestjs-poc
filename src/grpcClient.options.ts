import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

const options: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['book'], // 'author'
    protoPath: [
      join(__dirname, 'books/book.proto'),
      // join(__dirname, 'authors/author.proto'),
    ],
  },
};

export default options;
