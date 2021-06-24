import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';
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
  getMany(): Observable<Book[]> {
    const ids$ = new ReplaySubject<BookById>();
    ids$.next({ id: 1 });
    ids$.next({ id: 2 });
    ids$.next({ id: 3 });
    ids$.complete();

    const stream = this.bookProtoService.findMany(ids$.asObservable());
    console.log('stream');
    return stream.pipe(toArray());
  }

  @Get('books/:id')
  getById(@Param('id') id: number): Observable<Book> {
    return this.bookProtoService.findOne({ id: +id });
  }

  @GrpcMethod('BookService')
  async findOne(data: BookById): Promise<Book> {
    return this.booksService.findOneById(data.id);
  }

  @GrpcStreamMethod('BookService')
  findMany(data$: Observable<BookById>): Observable<Book> {
    const book$ = new Subject<Book>();

    const onNext = async ({ id }: BookById) => {
      console.log('id', id);
      const book = await this.booksService.findOneById(id);
      console.log('book', book);
      book$.next(book);
    };
    const onComplete = () => {
      console.log('complete');
      book$.complete();
    };
    data$.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return book$.asObservable();
  }
}
