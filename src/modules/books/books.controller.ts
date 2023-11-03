/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Book } from './schemas/book.schema';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { CreateBookDto } from './dto/create-book.dto';
import { BooksService } from './books.service';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags(Book.name)
@Controller({ path: 'users', version: '1' })
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @ApiOperation({ summary: 'Book Create' })
  @Post()
  @UseGuards(AuthenticatedGuard)
  async bookCreate(@Body() createBookDto: CreateBookDto, @Req() req) {
    createBookDto.user = req.user._id;
    return await this.booksService.createBook(createBookDto);
  }

  @ApiOperation({ summary: 'Book Update' })
  @Patch(':id')
  @UseGuards(AuthenticatedGuard)
  async bookUpdate(
    @Param('id') id: string,
    @Body() createBookDto: UpdateBookDto,
    @Req() req,
  ) {
    createBookDto.user = req.user._id;
    return await this.booksService.updateBook(id, createBookDto);
  }

  @ApiOperation({ summary: 'Book Delete' })
  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  async bookDelete(@Param('id') id: string, @Req() req) {
    return await this.booksService.deleteBook(id, req.user._id);
  }

  @ApiOperation({ summary: 'Book List' })
  @Get()
  @UseGuards(AuthenticatedGuard)
  async bookList() {
    return await this.booksService.getBooks();
  }
}
