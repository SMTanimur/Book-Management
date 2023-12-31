import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import 'colors';
import { ConfigurationService } from '../configuration/configuration.service';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configurationService: ConfigurationService) => ({
        uri: configurationService.MONGODB_URI,
        connectionFactory: (connection: Connection) => {
          if (connection.readyState === 1) {
            Logger.log(
              ` Alhamdulillah! MongoDB Connected with: ${connection.host} `
                .bgWhite.black,
            );
          }

          connection.on('disconnected', () => {
            Logger.warn('DB disconnected');
          });

          connection.on('error', (error) => {
            Logger.error(
              ` DB connection failed! for error: ${error} `.bgRed.black
                .underline.bold,
            );
          });

          return connection;
        },
      }),
      inject: [ConfigurationService],
    }),
  ],
})
export class DatabaseModule {}
