import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Book {
  @Field({ description: "The book's ID" })
  id: number;

  @Field({ description: "The book's title" })
  title: string;

  @Field({ description: "The book's author ID" })
  authorId: number;
}
