import {
  Controller,
  Body,
  Patch,
  SerializeOptions,
  Request,
  Get,
  UseGuards,
  Req,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';

import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './schema';
import { Role } from 'src/constants/roles.enum';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { Roles } from 'src/constants/roles.decorators';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags(User.name)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'User  Profile' })
  @ApiOkResponse({ description: 'success' })
  @Get('me')
  @UseGuards(AuthenticatedGuard)
  @Roles(Role.USER, Role.ADMIN)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async profile(@Req() req: any) {
    return await this.usersService.userFindOne(req?.user?._id);
  }
  @ApiOperation({ summary: 'Update user' })
  @ApiCreatedResponse({ description: 'User successfully updated' })
  @Patch()
  updateUser(@Body() updateUserDto: UpdateUserDto, @Request() request) {
    updateUserDto.userId = request.user._id;
    return this.usersService.update(updateUserDto);
  }

  @ApiOperation({ summary: 'User  Password Change' })
  @Post('change-password')
  @UseGuards(AuthenticatedGuard)
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req) {
    return this.usersService.changePassword({
      ...changePasswordDto,
      user: req.user,
    });
  }
}
