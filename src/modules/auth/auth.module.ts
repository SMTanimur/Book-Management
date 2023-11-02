import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { Module } from '@nestjs/common';
import { CustomStrategy } from './strategy/custom.strategy';
import { SessionSerializer } from './session.serializer';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, CustomStrategy, SessionSerializer, UsersService],
})
export class AuthModule {}
