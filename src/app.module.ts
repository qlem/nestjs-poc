import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorsModule } from './authors/authors.module';
import { AuthorsController } from './authors/authors.controller';
import { BooksModule } from './books/books.module';
import { BooksController } from './books/books.controller';
import { LoggerMiddleware } from './middleware';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    AuthorsModule,
    BooksModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/generated/schema.gql'),
      sortSchema: true,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(AppController, BooksController, AuthorsController);
  }
}
