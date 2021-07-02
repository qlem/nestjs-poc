import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import {
  ClientGrpc,
  GrpcMethod,
  GrpcStreamMethod,
} from '@nestjs/microservices';

import { MethodLogger } from '../decorators';

import { BooksService, BookModel } from './libraries.service';

interface GrpcBookQuery {
  id: number;
}

interface GrpcBookModel {
  id: number;
  title: string;
  authorId: number;
}

interface BookProtoService {
  findOne(data: GrpcBookQuery): Observable<GrpcBookModel>;
  findMany(upstream: Observable<GrpcBookQuery>): Observable<GrpcBookModel>;
}

@Controller()
export class LibrariesController implements OnModuleInit {
  private bookProtoService: BookProtoService;

  constructor(
    @Inject('BOOK_PACKAGE') private readonly client: ClientGrpc,
    private booksService: BooksService,
  ) {}

  onModuleInit() {
    this.bookProtoService =
      this.client.getService<BookProtoService>('BookService');
  }

  @Get('books')
  async getMany(): Promise<BookModel[]> {
    return this.booksService.findMany();
  }

  @Get('books/:id')
  async getById(@Param('id') id: string): Promise<BookModel> {
    return this.booksService.findOneById(+id);
  }

  @GrpcMethod('BookService')
  @MethodLogger({ className: 'GrpcBooks' })
  async findOne(data: GrpcBookQuery): Promise<GrpcBookModel> {
    return this.booksService.findOneById(data.id);
  }

  @GrpcStreamMethod('BookService')
  @MethodLogger({ className: 'GrpcBooks' })
  findMany(data$: Observable<GrpcBookQuery>): Observable<GrpcBookModel> {
    const book$ = new Subject<GrpcBookModel>();
    const onNext = async ({ id }: GrpcBookQuery) => {
      const book = await this.booksService.findOneById(id);
      book$.next(book);
    };

    data$.subscribe({
      next: onNext,
      complete: () => book$.complete(),
    });
    return book$.asObservable();
  }
}
