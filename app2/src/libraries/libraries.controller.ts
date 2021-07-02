import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import {
  ClientGrpc,
  GrpcMethod,
  GrpcStreamMethod,
} from '@nestjs/microservices';

import { MethodLogger } from '../decorators';

import { LibrariesService, LibraryModel } from './libraries.service';

interface GrpcLibraryQuery {
  id: number;
}

interface GrpcLibraryModel {
  id: number;
  name: string;
}

interface LibraryProtoService {
  findOne(data: GrpcLibraryQuery): Observable<GrpcLibraryModel>;
  findMany(
    upstream: Observable<GrpcLibraryQuery>,
  ): Observable<GrpcLibraryModel>;
}

@Controller()
export class LibrariesController implements OnModuleInit {
  private libraryProtoService: LibraryProtoService;

  constructor(
    @Inject('LIBRARY_PACKAGE') private readonly client: ClientGrpc,
    private LibraryService: LibrariesService,
  ) {}

  onModuleInit() {
    this.libraryProtoService =
      this.client.getService<LibraryProtoService>('LibraryService');
  }

  @Get('libraries')
  async getMany(): Promise<LibraryModel[]> {
    return this.LibraryService.findMany();
  }

  @Get('libraries/:id')
  async getById(@Param('id') id: string): Promise<LibraryModel> {
    return this.LibraryService.findOneById(+id);
  }

  @GrpcMethod('LibraryService')
  @MethodLogger({ className: 'GrpcLibraries' })
  async findOne(data: GrpcLibraryQuery): Promise<GrpcLibraryModel> {
    return this.LibraryService.findOneById(data.id);
  }

  @GrpcStreamMethod('LibraryService')
  @MethodLogger({ className: 'GrpcLibraries' })
  findMany(data$: Observable<GrpcLibraryQuery>): Observable<GrpcLibraryModel> {
    const library$ = new Subject<GrpcLibraryModel>();
    const onNext = async ({ id }: GrpcLibraryQuery) => {
      const library = await this.LibraryService.findOneById(id);
      library$.next(library);
    };

    data$.subscribe({
      next: onNext,
      complete: () => library$.complete(),
    });
    return library$.asObservable();
  }
}
