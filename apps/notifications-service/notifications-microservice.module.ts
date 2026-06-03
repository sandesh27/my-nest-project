import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../../src/notifications/notifications.module';
import { Notification } from '../../src/notifications/notification.entity';

/**
 * Notifications Microservice Module
 * This is the root module for the standalone notifications microservice
 *
 * Responsibilities:
 * 1. Loads environment variables via ConfigModule
 * 2. Configures database connection via TypeOrmModule
 * 3. Imports the NotificationsModule with all required providers and handlers
 *
 * When running standalone, this module ensures:
 * - Database connection is established before service starts
 * - All TypeORM repositories are available for injection
 * - Configuration is loaded from .env file
 */
@Module({
  imports: [
    /**
     * ConfigModule.forRoot()
     * Loads environment variables from .env file
     * Makes them accessible via ConfigService
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    /**
     * TypeOrmModule.forRootAsync()
     * Configures MySQL database connection using environment variables
     * Required for the NotificationsModule to inject Repository<Notification>
     *
     * Configuration:
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
        entities: [Notification],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: false,
      }),
    }),

    NotificationsModule,
  ],
})
export class NotificationsMicroserviceModule {}
