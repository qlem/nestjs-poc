import { Injectable } from '@nestjs/common';
import { Author as AuthorModel } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthorsService {
  constructor(private prismaService: PrismaService) {}

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
