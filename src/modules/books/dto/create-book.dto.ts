import { PickType } from '@nestjs/swagger';
import { Book } from '../schemas/book.schema';
export class CreateBookDto extends PickType(Book, [
  'author',
  'descriptions',
  'title',
  'user',
  'publishedYear',
]) {}
