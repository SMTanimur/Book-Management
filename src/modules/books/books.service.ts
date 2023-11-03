/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookSchema } from './schemas/book.schema';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookSchema>) {}

  async createBook(createBookDto: CreateBookDto) {
    return await this.bookModel.create(createBookDto);
  }
  async getBooks() {
    return await this.bookModel.find({});
  }

  async getBook(id: string) {
    return await this.bookModel.findById(id);
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.bookModel.findById(id);
    if (book.user.toString() !== updateBookDto.user.toString()) {
      throw new ConflictException(
        'You are not authorized to update this book.',
      );
    }
    return await this.bookModel.findByIdAndUpdate(id, updateBookDto);
  }

  async deleteBook(id: string, user: string) {
    const book = await this.bookModel.findById(id);
    if (book.user.toString() !== user.toString()) {
      throw new ConflictException(
        'You are not authorized to delete this book.',
      );
    }
    return await this.bookModel.findByIdAndDelete(id);
  }
}
