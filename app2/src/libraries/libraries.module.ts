import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { CoreModule } from '../core/core.module';

import { LibrariesController } from './libraries.controller';
import { LibrariesResolver } from './libraries.resolver';
import { LibrariesService } from './libraries.service';

@Module({
  controllers: [LibrariesController],
  providers: [LibrariesResolver, LibrariesService],
  imports: [
    ClientsModule.register([
      {
        name: 'BOOK_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'library',
          protoPath: join(__dirname, 'library.proto'),
        },
      },
    ]),
    CoreModule,
  ],
})
export class LibrariesModule {}
