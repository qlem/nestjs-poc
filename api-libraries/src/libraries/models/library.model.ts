import { Field, ObjectType } from '@nestjs/graphql';

import { Book } from './book.model';

@ObjectType()
export class Library {
  @Field({ description: "The library's ID" })
  id: number;

  @Field({ description: "The library's name" })
  name: string;

  @Field(() => [Book], { description: 'Books in the library' })
  books: Book[];
}
