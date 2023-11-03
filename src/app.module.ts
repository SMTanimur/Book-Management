import { UsersModule } from './modules/users/users.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';
import { BooksModule } from './modules/books/books.module';

@Module({
  imports: [UsersModule, AuthModule, CoreModule, BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
