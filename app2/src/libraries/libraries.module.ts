import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { CoreModule } from '../core/core.module';

import { LibrariesController } from './libraries.controller';
import { LibrariesResolver } from './libraries.resolver';
import { LibrariesService } from './libraries.service';

console.log(join(process.cwd(), './../proto/library.proto'));

@Module({
  controllers: [LibrariesController],
  providers: [LibrariesResolver, LibrariesService],
  imports: [
    ClientsModule.register([
      {
        name: 'LIBRARY_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'library',
          protoPath: join(process.cwd(), '../proto/library.proto'),
        },
      },
    ]),
    CoreModule,
  ],
})
export class LibrariesModule {}
