import { Injectable } from '@nestjs/common';
import { Author, Book } from '@prisma/client';

import { MethodLogger } from '../decorators';
import { PrismaService } from '../core/prisma.service';

export type AuthorModel = Author & { books: Book[] };

@Injectable()
export class AuthorsService {
  constructor(private prismaService: PrismaService) {}

  @MethodLogger()
  async createOne({ name }: { name: string }): Promise<AuthorModel> {
    return this.prismaService.author.create({
      data: {
        name,
      },
      include: {
        books: true,
      },
    });
  }

  @MethodLogger()
  async removeOneById(id: number): Promise<AuthorModel> {
    return this.prismaService.author.delete({
      where: {
        id,
      },
      include: {
        books: true,
      },
    });
  }

  @MethodLogger()
  async findMany(): Promise<AuthorModel[]> {
    return this.prismaService.author.findMany({
      include: {
        books: true,
      },
    });
  }

  @MethodLogger()
  async findOneById(id: number): Promise<AuthorModel> {
    return this.prismaService.author.findUnique({
      where: {
        id,
      },
      include: {
        books: true,
      },
    });
  }
}
