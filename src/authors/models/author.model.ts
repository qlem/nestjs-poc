import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Author {
  @Field({ description: "The author's ID" })
  id: string;

  @Field({ description: "The author's name" })
  name: string;
}
