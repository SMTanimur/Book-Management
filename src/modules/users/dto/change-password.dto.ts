import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  newPassword: string;

  @IsOptional()
  user: any;
}
