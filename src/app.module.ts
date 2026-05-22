import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';
import { Note } from './notes/note.entity';

/**
 * AppModule
 *
 * This is the root module of the application.
 * It imports all feature modules (UsersModule, NotesModule, etc.)
 * and configures global setups like database connections.
 *
 * In Angular, this is similar to the AppModule that bootstraps the application.
 * In NestJS, the AppModule serves a similar purpose for organizing the application structure.
 *
 * Key features of this AppModule:
 * 1. ConfigModule.forRoot() - Loads environment variables from .env file and makes them available via ConfigService.
 * 2. TypeOrmModule.forRootAsync() - Configures the database connection using environment variables.
 *
 * This module also registers the AppController and AppService, which handle the root route and provide a simple greeting message.
 *
 * For more complex applications, you would typically have multiple modules for different features (e.g., UsersModule, NotesModule) that are imported into the AppModule to keep related functionality organized.
 *
 * For more details on modules in NestJS, see:
 * https://docs.nestjs.com/modules
 */
@Module({
  imports: [
    /**
     * ConfigModule.forRoot()
     *
     * Loads environment variables from .env file
     * Makes them accessible via ConfigService
     * This allows credentials to not be hardcoded in the code
     */
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available in all modules
      envFilePath: '.env', // Path to .env file
    }),

    /**
     * TypeOrmModule.forRootAsync()
     *
     * Configures database connection using environment variables
     * The async version allows us to use ConfigService to inject env vars
     *
     * Configuration from environment variables:
     * - DB_HOST: MySQL server hostname (default: localhost)
     * - DB_PORT: MySQL port (default: 3306)
     * - DB_USERNAME: MySQL username (default: root)
     * - DB_PASSWORD: MySQL password
     * - DB_NAME: Database name (default: nest_db)
     */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: parseInt(configService.get('DB_PORT', '3306')),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'nest_db'),
        entities: [Note],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: false,
      }),
    }),
    UsersModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
