/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { omit, pick } from 'lodash';
import { ConfigurationService } from '../configuration/configuration.service';
import { CustomAuthGuard } from './guards/custom-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configurationService: ConfigurationService,
  ) {}

  @ApiOperation({ summary: 'Register New User' })
  @ApiOkResponse({ description: 'Register user' })
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Session() session: any,
  ) {
    const data = await this.usersService.createUser(createUserDto);

    const user = pick(data, [
      '_id',
      'email',
      'username',
      'fullName',
      'role',
      'avatar',
    ]);

    session.passport = { user };
    return {
      message: `Welcome to Books Management! 🎉`,
      user: omit(data, 'password'),
    };
    // return await this.UsersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Logs user into the system' })
  @ApiOkResponse({ description: 'Logged in successfully.' })
  @UseGuards(CustomAuthGuard)
  @Post('login')
  async login(
    @Req() req,

    @Body() _body: LoginDto,
  ) {
    return { message: 'Welcome back! 🎉', user: req.user };
  }

  @ApiOperation({ summary: 'User Logout Attempt' })
  @ApiOkResponse({
    description: 'User logout successfully.',
  })
  @Delete('logout')
  async logout(@Req() req, @Res() res) {
    await req.session.destroy(() => null);
    await res.clearCookie(this.configurationService.SESSION_NAME);
    await req.logout(() => null);
    return res.status(200).send('Successfully logout');
  }
}
