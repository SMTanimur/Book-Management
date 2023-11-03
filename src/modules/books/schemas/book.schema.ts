import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/modules/users/schema';

export type BookSchema = Book & Document;

@Schema({ timestamps: true })
export class Book {
  @IsString()
  @ApiProperty()
  @MinLength(2)
  @MaxLength(50)
  @Prop({ required: true, unique: true })
  title: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Prop({ required: true, unique: true })
  author: string;

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(500)
  @Prop()
  descriptions: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  publishedYear: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Schema.Types.ObjectId;
}

export const BookSchema = SchemaFactory.createForClass(Book);
