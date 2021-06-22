import { Field, ObjectType } from '@nestjs/graphql';

import { Book } from '../../books/models/book.model';

@ObjectType()
export class Author {
  @Field({ description: "The author's ID" })
  id: number;

  @Field({ description: "The author's name" })
  name: string;

  @Field(() => [Book], { description: 'Books written by the author' })
  books: Book[];
}
