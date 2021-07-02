import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibrariesModule } from './libraries/libraries.module';
import { LibrariesController } from './libraries/libraries.controller';
import { LoggerMiddleware } from './middleware';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    LibrariesModule,
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
      .forRoutes(AppController, LibrariesController);
  }
}
