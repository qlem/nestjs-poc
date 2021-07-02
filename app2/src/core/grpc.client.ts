import { Injectable } from '@nestjs/common';
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'path';
import { MethodLogger } from '../decorators';

interface Book {
  id: number;
  title: string;
  authorId: number;
}

interface BookQuery {
  id: number;
}

interface BookClient {
  findOne: (
    query: BookQuery,
    callback: (err: Error, book: Book) => void,
  ) => void;
  findMany: (query: BookQuery) => void;
}

@Injectable()
export class GrpcClient {
  private client: BookClient;

  constructor() {
    const packageDefinition = loadSync(
      join(__dirname, '../../../proto/book.proto'),
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    );
    const service = loadPackageDefinition(packageDefinition).book;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.client = new service.BookService(
      'localhost:5000',
      credentials.createInsecure(),
    );
  }

  @MethodLogger()
  async call(id: number): Promise<Book> {
    return new Promise((resolve, reject) => {
      this.client.findOne({ id }, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  }
}
