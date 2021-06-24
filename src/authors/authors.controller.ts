import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import {
  ClientGrpc,
  GrpcMethod,
  GrpcStreamMethod,
} from '@nestjs/microservices';

import { AuthorsService, AuthorModel } from './authors.service';

interface GrpcAuthorQuery {
  id: number;
}

interface GrpcAuthorModel {
  id: number;
  name: string;
}

interface AuthorProtoService {
  findOne(data: GrpcAuthorQuery): Observable<GrpcAuthorModel>;
  findMany(upstream: Observable<GrpcAuthorQuery>): Observable<GrpcAuthorModel>;
}

@Controller()
export class AuthorsController implements OnModuleInit {
  private authorProtoService: AuthorProtoService;

  constructor(
    @Inject('AUTHOR_PACKAGE') private readonly client: ClientGrpc,
    private authorsService: AuthorsService,
  ) {}

  onModuleInit() {
    this.authorProtoService =
      this.client.getService<AuthorProtoService>('AuthorService');
  }

  @Get('authors')
  async getMany(): Promise<AuthorModel[]> {
    return this.authorsService.findMany();
  }

  @Get('authors/:id')
  async getById(@Param('id') id: string): Promise<AuthorModel> {
    return this.authorsService.findOneById(+id);
  }

  @GrpcMethod('AuthorService')
  async findOne(data: GrpcAuthorQuery): Promise<GrpcAuthorModel> {
    return this.authorsService.findOneById(data.id);
  }

  @GrpcStreamMethod('AuthorService')
  findMany(data$: Observable<GrpcAuthorQuery>): Observable<GrpcAuthorModel> {
    const author$ = new Subject<GrpcAuthorModel>();
    const onNext = async ({ id }: GrpcAuthorQuery) => {
      const author = await this.authorsService.findOneById(id);
      author$.next(author);
    };

    data$.subscribe({
      next: onNext,
      complete: () => author$.complete(),
    });
    return author$.asObservable();
  }
}
