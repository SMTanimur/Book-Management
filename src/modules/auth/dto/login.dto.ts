import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ default: 'smtrstar@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ default: '123456' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiPropertyOptional({ default: 'user' })
  @IsOptional()
  @IsString()
  role?: string;
}
