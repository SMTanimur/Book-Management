import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { Module } from '@nestjs/common';
import { CustomStrategy } from './strategy/custom.strategy';
import { SessionSerializer } from './session.serializer';
import { UsersService } from '../users/users.service';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, CustomStrategy, SessionSerializer, UsersService],
})
export class AuthModule {}
