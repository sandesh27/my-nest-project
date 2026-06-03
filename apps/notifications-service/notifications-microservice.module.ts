import { Module } from '@nestjs/common';
import { NotificationsModule } from '../../src/notifications/notifications.module';

/**
 * Notifications Microservice Module
 * This is the root module for the standalone notifications microservice
 */
@Module({
  imports: [NotificationsModule],
})
export class NotificationsMicroserviceModule {}
