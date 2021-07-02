import { Injectable } from '@nestjs/common';
import { Library as LibraryModel } from '@prisma/client';

import { MethodLogger } from '../decorators';
import { PrismaService } from '../core/prisma.service';
import { LoggerService } from '../core/logger.service';

@Injectable()
class LibrariesService {
  constructor(
    private logger: LoggerService,
    private prismaService: PrismaService,
  ) {
    this.logger.setContext(LibrariesService.name);
  }

  @MethodLogger()
  async createOne({ name }: { name: string }): Promise<LibraryModel> {
    return this.prismaService.library.create({
      data: { name },
    });
  }

  @MethodLogger()
  async removeOneById(id: number): Promise<LibraryModel> {
    return this.prismaService.library.delete({
      where: { id },
    });
  }

  @MethodLogger()
  async findMany(): Promise<LibraryModel[]> {
    return this.prismaService.library.findMany();
  }

  @MethodLogger()
  async findOneById(id: number): Promise<LibraryModel> {
    return this.prismaService.library.findUnique({
      where: { id },
    });
  }
}

export { LibrariesService, LibraryModel };
