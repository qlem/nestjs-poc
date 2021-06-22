import { Injectable } from '@nestjs/common';

import { books as data } from '../../database.json';

@Injectable()
export class BooksService {
  /**
   * MOCK
   * Put some real business logic here
   * Left for demonstration purposes
   */

  async create({
    title,
    authorId,
  }: {
    title: string;
    authorId: string;
  }): Promise<{ title: string; authorId: string }> {
    return {
      title,
      authorId,
    };
  }

  async remove(id: string): Promise<boolean> {
    return true;
  }

  async findOneById(
    id: string,
  ): Promise<{ id: string; title: string; authorId: string }> {
    return data.find((book) => book.id === id);
  }
}
