import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { CoreModule } from '../core/core.module';

import { BooksController } from './books.controller';
import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';

@Module({
  controllers: [BooksController],
  providers: [BooksResolver, BooksService],
  imports: [
    ClientsModule.register([
      {
        name: 'BOOK_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'book',
          protoPath: join(__dirname, 'book.proto'),
        },
      },
    ]),
    CoreModule,
  ],
})
export class BooksModule {}
