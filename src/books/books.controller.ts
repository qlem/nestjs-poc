import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import {
  ClientGrpc,
  GrpcMethod,
  GrpcStreamMethod,
} from '@nestjs/microservices';

import { BooksService } from './books.service';

interface BookById {
  id: number;
}

interface Book {
  id: number;
  title: string;
  authorId: number;
}

interface BookProtoService {
  findOne(data: BookById): Observable<Book>;
  findMany(upstream: Observable<BookById>): Observable<Book>;
}

@Controller()
export class BooksController implements OnModuleInit {
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
  async getMany(): Promise<Book[]> {
    return this.booksService.findMany();
  }

  @Get('books/:id')
  async getById(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOneById(+id);
  }

  @GrpcMethod('BookService')
  async findOne(data: BookById): Promise<Book> {
    return this.booksService.findOneById(data.id);
  }

  @GrpcStreamMethod('BookService')
  findMany(data$: Observable<BookById>): Observable<Book> {
    const book$ = new Subject<Book>();
    const onNext = async ({ id }: BookById) => {
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
