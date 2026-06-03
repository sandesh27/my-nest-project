import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

/**
 * Microservice Client Service
 * Provides methods for communicating with other microservices
 * This service acts as a bridge between the main app and standalone microservices
 *
 * Example usage:
 * - Notify users when their orders status changes
 * - Query notifications from the notifications microservice
 * - Send events to other services
 */
@Injectable()
export class MicroserviceClientService implements OnModuleDestroy {
  private notificationsClient: ClientProxy;

  constructor() {
    // Create a connection to the notifications microservice
    this.notificationsClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001, // Notifications microservice port
      },
    });
  }

  /**
   * Emit an event to the notifications microservice
   * Used for sending order events (created, completed, cancelled)
   */
  async emitNotificationEvent(
    pattern: string,
    payload: Record<string, unknown>,
  ) {
    try {
      const result = await firstValueFrom(
        this.notificationsClient.emit(pattern, payload),
      );
      console.log(`Event '${pattern}' sent successfully:`, result);
      return result;
    } catch (error) {
      console.error(
        `Failed to send event '${pattern}':`,
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  }

  /**
   * Send a request-reply message to the notifications microservice
   * Used for querying data (e.g., get notifications)
   */
  async sendToNotificationService(
    pattern: string,
    payload: Record<string, unknown>,
  ) {
    try {
      const result = await firstValueFrom(
        this.notificationsClient.send(pattern, payload),
      );
      console.log(
        `Request '${pattern}' sent to notifications service:`,
        result,
      );
      return result;
    } catch (error) {
      console.error(
        `Failed to send request '${pattern}' to notifications service:`,
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  }

  /**
   * Notify user about order creation
   */
  async notifyOrderCreated(
    orderId: number,
    userId: number,
    productName: string,
  ) {
    return this.emitNotificationEvent('order_created', {
      orderId,
      userId,
      productName,
    });
  }

  /**
   * Notify user about order completion
   */
  async notifyOrderCompleted(orderId: number, userId: number) {
    return this.emitNotificationEvent('order_completed', {
      orderId,
      userId,
    });
  }

  /**
   * Notify user about order cancellation
   */
  async notifyOrderCancelled(orderId: number, userId: number) {
    return this.emitNotificationEvent('order_cancelled', {
      orderId,
      userId,
    });
  }

  /**
   * Query notifications for a user from the notifications microservice
   */
  async getNotifications(userId: number) {
    return this.sendToNotificationService('get_notifications', { userId });
  }

  /**
   * Close the client connection when the app is shut down
   */
  async onModuleDestroy() {
    await this.notificationsClient.close();
  }
}
