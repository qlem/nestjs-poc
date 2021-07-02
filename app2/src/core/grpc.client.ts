import { Injectable } from '@nestjs/common';
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'path';

import { MethodLogger } from '../decorators';

export interface GrpcBookModel {
  id: number;
  title: string;
  authorId: number;
}

interface GrpcBookQuery {
  id: number;
}

interface BookClient {
  findOne: (
    query: GrpcBookQuery,
    callback: (err: Error, book: GrpcBookModel) => void,
  ) => void;
  findMany: any;
}

@Injectable()
export class GrpcClient {
  private client: BookClient;

  constructor() {
    const packageDefinition = loadSync(
      join(process.cwd(), '../proto/book.proto'),
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
  async findOne(id: number): Promise<GrpcBookModel> {
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

  @MethodLogger()
  async findMany(ids: number[]): Promise<GrpcBookModel[]> {
    if (!ids.length) {
      return [];
    }

    return new Promise((resolve, reject) => {
      const books: GrpcBookModel[] = [];
      const call = this.client.findMany();

      call.on('data', (book: GrpcBookModel) => {
        books.push(book);
        if (books.length === ids.length) {
          call.end();
        }
      });

      call.on('error', (err) => {
        reject(err);
      });

      call.on('end', () => {
        resolve(books);
      });

      ids.forEach((id) => {
        call.write({ id });
      });

      setTimeout(() => {
        call.end();
        reject(new Error('gRPC streaming call timeout'));
      }, 300);
    });
  }
}
