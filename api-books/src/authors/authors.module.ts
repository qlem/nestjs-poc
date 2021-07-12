import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { CoreModule } from '../core/core.module';

import { AuthorsController } from './authors.controller';
import { AuthorsResolver } from './authors.resolver';
import { AuthorsService } from './authors.service';

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsResolver, AuthorsService],
  imports: [
    ClientsModule.register([
      {
        name: 'AUTHOR_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'author',
          protoPath: join(process.cwd(), '../proto/author.proto'),
        },
      },
    ]),
    CoreModule,
  ],
})
export class AuthorsModule {}
