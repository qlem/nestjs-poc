import { Library as LibraryModel } from '@prisma/client';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { MethodLogger } from '../decorators';
import { GrpcClient } from '../core/grpc.client';
import { GrpcBookModel as BookGrpcModel } from '../core/grpc.client';

import { Book } from './models/book.model';
import { Library } from './models/library.model';
import { LibrariesService } from './libraries.service';

@Resolver(() => Library)
export class LibrariesResolver {
  constructor(
    private libraryService: LibrariesService,
    private grpcClient: GrpcClient,
  ) {}

  @Query(() => Library, {
    description: 'Query used to fetch one library by id',
  })
  @MethodLogger()
  async library(@Args('id', { type: () => Int }) id: number) {
    return this.libraryService.findOneById(id);
  }

  @Mutation(() => Library, {
    description: 'Mutation used to create a new library',
  })
  @MethodLogger()
  async createLibrary(@Args('name', { type: () => String }) name: string) {
    return this.libraryService.createOne({ name });
  }

  @Mutation(() => Library, {
    description: 'Mutation used to remove a library by id',
  })
  @MethodLogger()
  async removeLibrary(@Args('id', { type: () => Int }) id: number) {
    return this.libraryService.removeOneById(id);
  }

  @ResolveField(() => [Book])
  @MethodLogger()
  async books(@Parent() library: LibraryModel): Promise<BookGrpcModel[]> {
    const { bookIds } = library;
    return this.grpcClient.findMany(bookIds);
  }
}
