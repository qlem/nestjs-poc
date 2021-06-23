import { Module } from '@nestjs/common';

import { CoreModule } from '../core/core.module';

import { AuthorsResolver } from './authors.resolver';
import { AuthorsService } from './authors.service';

@Module({
  providers: [AuthorsResolver, AuthorsService],
  imports: [CoreModule],
})
export class AuthorsModule {}
