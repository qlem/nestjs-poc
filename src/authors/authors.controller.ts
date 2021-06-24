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
  getMany(): Observable<Author[]> {
    const ids$ = new ReplaySubject<AuthorById>();
    ids$.next({ id: 1 });
    ids$.next({ id: 2 });
    ids$.complete();

    const stream = this.authorProtoService.findMany(ids$.asObservable());
    console.log('stream');
    return stream.pipe(toArray());
  }

  @Get('authors/:id')
  getById(@Param('id') id: number): Observable<Author> {
    return this.authorProtoService.findOne({ id: +id });
  }

  @GrpcMethod('AuthorService')
  async findOne(data: AuthorById): Promise<Author> {
    return this.authorsService.findOneById(data.id);
  }

  @GrpcStreamMethod('AuthorService')
  findMany(data$: Observable<AuthorById>): Observable<Author> {
    const author$ = new Subject<Author>();

    const onNext = async ({ id }: AuthorById) => {
      console.log('id', id);
      const author = await this.authorsService.findOneById(id);
      console.log('author', author);
      author$.next(author);
    };
    const onComplete = () => {
      console.log('complete');
      author$.complete();
    };
    data$.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return author$.asObservable();
  }
}
