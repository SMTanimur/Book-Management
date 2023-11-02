import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as bcrypt from 'bcryptjs';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/constants/roles.enum';

@Schema({ timestamps: true })
export class User {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @ApiProperty({ example: 'Jhon due' })
  @Prop({ required: true })
  fullName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @ApiProperty({ example: 'jhonDue' })
  @Prop({ required: true, unique: true })
  userName: string;

  @IsEmail()
  @ApiProperty({ example: 'example@gmail.com' })
  @Prop({ required: true, unique: true })
  email: string;

  @IsString()
  @IsOptional()
  @Prop({
    type: String,
    default:
      'https://res.cloudinary.com/smtanimur/image/upload/v1658841812/mushfiqTanim/user_qcrqny_kcgfes.svg',
  })
  avatar?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(150)
  @ApiProperty({ example: '123456' })
  @Prop({ required: true })
  password: string;

  @IsEnum(Role)
  @IsOptional()
  @Prop({
    enum: [Role.ADMIN, Role.USER],
    default: Role.USER,
    type: String,
  })
  role?: string;
}

export interface UserDocument extends User {
  comparePassword?(password: string): Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  const user = this as UserDocument;
  return await bcrypt.compare(password, user.password);
};
