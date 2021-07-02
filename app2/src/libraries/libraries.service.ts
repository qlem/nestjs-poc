import { Injectable } from '@nestjs/common';
import { Library as LibraryModel } from '@prisma/client';

import { MethodLogger } from '../decorators';
import { PrismaService } from '../core/prisma.service';
import { LoggerService } from '../core/logger.service';

@Injectable()
export class LibrariesService {
  constructor(
    private logger: LoggerService,
    private prismaService: PrismaService,
  ) {
    this.logger.setContext(LibrariesService.name);
  }

  @MethodLogger()
  async createOne({
    title,
    authorId,
  }: {
    title: string;
    authorId: number;
  }): Promise<LibraryModel> {
    return this.prismaService.library.create({
      data: {
        title,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      include: {
        author: true,
      },
    });
  }

  @MethodLogger()
  async removeOneById(id: number): Promise<LibraryModel> {
    return this.prismaService.library.delete({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
  }

  @MethodLogger()
  async findMany(): Promise<LibraryModel[]> {
    return this.prismaService.library.findMany({
      include: {
        author: true,
      },
    });
  }

  @MethodLogger()
  async findOneById(id: number): Promise<LibraryModel> {
    return this.prismaService.library.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
  }
}
