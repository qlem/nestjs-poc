import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { AuthorsResolver } from './authors.resolver';
import { AuthorsService } from './authors.service';

@Module({
  providers: [AuthorsResolver, AuthorsService, PrismaService],
})
export class AuthorsModule {}
