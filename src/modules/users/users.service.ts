import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'src/utils/hash';
import { LoginDto } from '../auth/dto/login.dto';
import { pick } from 'lodash';
import { User, UserDocument } from './schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto) {
    await this.validateCreateUserRequest(createUserDto);
    createUserDto.password = await createHash(createUserDto.password);
    return await this.userModel.create(createUserDto);
  }

  private async validateCreateUserRequest(createUserDto: CreateUserDto) {
    let user: UserDocument;
    try {
      user = await this.userModel.findOne({
        email: createUserDto.email,
      });
    } catch (err) {
      console.error(err.message);
    }

    if (user) {
      throw new UnprocessableEntityException('User already exists.');
    }
  }

  async validateUser(loginDto: LoginDto) {
    const { email, password, role = 'customer' } = loginDto;

    const user = await this.userModel.findOne({ email, role });

    if (!user) throw new NotFoundException('There is no user with this email.');

    if (!(await user.comparePassword(password))) {
      throw new UnauthorizedException('The password you entered is incorrect.');
    }
    if (user.role !== role)
      throw new UnauthorizedException('You are not authorized to login.');
    console.log(user);
    return pick(user.toJSON(), [
      '_id',
      'username',
      'email',
      'name',
      'role',
      'avatar',
    ]);
  }

  async validatePassword(userId: string, password: string) {
    const user = await this.userModel.findOne({ _id: userId });

    if (!(await user.comparePassword(password)))
      throw new UnauthorizedException('The password you entered is incorrect.');

    return true;
  }

  async userFindOne(id: string) {
    const user = await this.userModel.findOne({ _id: id });
    delete user.password;
    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    const { userId } = updateUserDto;
    await this.userModel.findByIdAndUpdate(userId, {
      $set: updateUserDto,
    });
    return {
      message: 'successfully updated user',
    };
  }
}
