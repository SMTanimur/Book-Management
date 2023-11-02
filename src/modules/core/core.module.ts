import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { ConfigurationModule } from '../configuration/configuration.module';

// @Global()
@Module({
  imports: [
    DatabaseModule,
    ConfigurationModule,
    PassportModule.register({ session: true }),
  ],
  providers: [],
  exports: [],
})
export class CoreModule {}
