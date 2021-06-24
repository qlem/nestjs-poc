import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import {
  ClientGrpc,
  GrpcMethod,
  GrpcStreamMethod,
} from '@nestjs/microservices';

import { AuthorsService } from './authors.service';

interface AuthorById {
  id: number;
}

interface Author {
  id: number;
  name: string;
}

interface AuthorProtoService {
  findOne(data: AuthorById): Observable<Author>;
  findMany(upstream: Observable<AuthorById>): Observable<Author>;
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
  async getMany(): Promise<Author[]> {
    return this.authorsService.findMany();
  }

  @Get('authors/:id')
  getById(@Param('id') id: number): Observable<Author> {
    return this.authorProtoService.findOne({ id });
  }

  @GrpcMethod('AuthorService')
  async findOne(data: AuthorById): Promise<Author> {
    return this.authorsService.findOneById(data.id);
  }

  @GrpcStreamMethod('AuthorService')
  findMany(data$: Observable<AuthorById>): Observable<Author> {
    const author$ = new Subject<Author>();
    const onNext = async ({ id }: AuthorById) => {
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
