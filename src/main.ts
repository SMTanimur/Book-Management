import * as MongoDBStore from 'connect-mongodb-session';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import 'colors';
import * as session from 'express-session';
import * as passport from 'passport';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigurationService } from './modules/configuration/configuration.service';

const MongoStore = MongoDBStore(session);

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configurationService =
      app.get<ConfigurationService>(ConfigurationService);

    app.enableCors({
      credentials: true,
      origin: [''],
    });

    // Enable API versioning
    app.enableVersioning({
      type: VersioningType.URI,
    });

    // Swagger Setup
    const config = new DocumentBuilder()
      .setTitle('Book-Management - An API for Book-Management')
      .setVersion('1.0')
      .addServer(configurationService.API_URL)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    // Express session configuration
    app.use(
      session({
        name: configurationService.SESSION_NAME,
        secret: configurationService.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          httpOnly: true,
          // TODO: Need to check when it's live on the production server
          // sameSite: ServerConfig.NODE_ENV !== 'production' ? 'none' : 'lax',
          sameSite: 'lax',
          // TODO: Enable secure cookie in production
          secure: false, //|| ServerConfig.NODE_ENV === 'production',
        },
        store: new MongoStore({
          uri: configurationService.MONGODB_URI,
          collection: 'sessions',
          expires: 30 * 24 * 60 * 60 * 1000, // 30 days
        }),
      }),
    );
    // Passport configuration
    app.use(passport.initialize());
    app.use(passport.session());

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const port = process.env.PORT || 6000;
    await app.listen(port);
    Logger.log(
      ` Alhamdulillah! - Application is running on: http://localhost:${port} 🚀 `
        .bgCyan.black,
    );
  } catch (error) {
    Logger.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
}

bootstrap();
