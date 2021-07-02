import { Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { LoggerService } from './logger.service';
// import { GrpcClient } from './grpc.client';

@Module({
  providers: [PrismaService, LoggerService],
  exports: [PrismaService, LoggerService],
})
export class CoreModule {}
