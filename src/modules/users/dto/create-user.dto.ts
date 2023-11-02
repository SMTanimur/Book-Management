import { PickType } from '@nestjs/swagger';
import { User } from '../schema';

export class CreateUserDto extends PickType(User, [
  'fullName',
  'userName',
  'email',
  'password',

  'avatar',
  'role',
]) {}
