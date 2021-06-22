import { Field, ObjectType } from '@nestjs/graphql';

import { Author } from '../../authors/models/author.model';

@ObjectType()
export class Book {
  @Field({ description: "The book's ID" })
  id: number;

  @Field({ description: "The book's title" })
  title: string;

  @Field(() => Author, { description: "The book's author" })
  author: Author;
}
