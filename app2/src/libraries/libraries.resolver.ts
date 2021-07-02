import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { MethodLogger } from '../decorators';

import { Library } from './models/library.model';
import { LibrariesService } from './libraries.service';

@Resolver(() => Library)
export class LibrariesResolver {
  constructor(private LibraryService: LibrariesService) {}

  @Query(() => Library, {
    description: 'Query used to fetch one library by id',
  })
  @MethodLogger()
  async library(@Args('id', { type: () => Int }) id: number) {
    return this.LibraryService.findOneById(id);
  }

  @Mutation(() => Library, {
    description: 'Mutation used to create a new library',
  })
  @MethodLogger()
  async createLibrary(@Args('name', { type: () => String }) name: string) {
    return this.LibraryService.createOne({ name });
  }

  @Mutation(() => Library, {
    description: 'Mutation used to remove a library by id',
  })
  @MethodLogger()
  async removeLibrary(@Args('id', { type: () => Int }) id: number) {
    return this.LibraryService.removeOneById(id);
  }
}
