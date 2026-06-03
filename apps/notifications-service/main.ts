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
async function bootstrap() {
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
