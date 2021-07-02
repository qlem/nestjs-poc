import { Injectable } from '@nestjs/common';
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { join } from 'path';

@Injectable()
export class GrpcClient {
  private client: any;

  constructor() {
    const packageDefinition = protoLoader.loadSync(
      join(__dirname, '../../../proto/book.proto'),
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    );
    const service = loadPackageDefinition(packageDefinition).bookservice;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.client = new service.BookService(
      'localhost:5000',
      credentials.createInsecure(),
    );
  }

  call(id: number) {
    this.client.findOne({ id }, (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        console.log('doc', doc);
      }
    });
  }
}
