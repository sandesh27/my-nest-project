import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { NotificationsMicroserviceModule } from './notifications-microservice.module';

/**
 * Notifications Microservice Bootstrap
 * This entry point starts the notifications service as a standalone microservice
 * It listens on TCP protocol for messages from other services
 *
 * How to run:
 * npx ts-node apps/notifications-service/main.ts
 *
 * The service will:
 * 1. Start on TCP port 3001
 * 2. Listen for messages like:
 *    - 'order_created'
 *    - 'order_completed'
 *    - 'order_cancelled'
 *    - 'get_notifications'
 * 3. Process events and send notifications
 */

/**
 * Bootstrap the notifications microservice
 *
 * Creates and starts a NestJS microservice that:
 * - Runs independently from the main application
 * - Listens on localhost:3001 using TCP transport
 * - Handles all notification-related message patterns
 * - Provides request-reply messaging for querying notifications
 * - Handles errors gracefully with process exit code on failure
 *
 * @returns {Promise<void>} Resolves when the service is listening
 *
 * @throws {Error} Logs error and exits with code 1 if startup fails
 *
 * @example
 * // In terminal:
 * npx ts-node apps/notifications-service/main.ts
 * // Output: 🔔 Notifications Microservice is listening on port 3001...
 *
 * @remarks
 * Environment: Requires NestJS and @nestjs/microservices installed
 * Port: Uses TCP port 3001 (ensure port is available)
 * Module: Imports NotificationsMicroserviceModule with all required providers
 */
async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      NotificationsMicroserviceModule,
      {
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001, // Different port from main app (3000)
        },
      },
    );

    console.log('🔔 Notifications Microservice is listening on port 3001...');
    await app.listen();
  } catch (error) {
    console.error(
      'Failed to start notifications microservice:',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

bootstrap();
