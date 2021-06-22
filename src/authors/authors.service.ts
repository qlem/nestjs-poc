import { Injectable } from '@nestjs/common';
import { Author } from './models/author.model';

import { authors as data } from '../../database.json';

@Injectable()
export class AuthorsService {
  /**
   * MOCK
   * Put some real business logic here
   * Left for demonstration purposes
   */

  async create({ name }: { name: string }): Promise<{ name: string }> {
    return {
      name,
    };
  }

  async remove(id: string): Promise<boolean> {
    return true;
  }

  async findOneById(id: string): Promise<Author> {
    return data.find((author) => author.id === id);
  }
}
