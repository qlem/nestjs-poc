import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class NewBookInput {
  @Field({ description: "The book's title" })
  title: string;

  @Field({ description: "The author's ID" })
  authorId: number;
}
