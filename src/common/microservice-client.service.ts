import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

/**
 * Microservice response interface
 * Provides type-safe responses from microservice operations
 */
interface MicroserviceResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

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
   *
   * @param {string} pattern - The message pattern name (e.g., 'order_created')
   * @param {Record<string, unknown>} payload - Data to send with the event
   * @returns {Promise<any>} Result from microservice emit
   *
   * @example
   * await this.microserviceClient.emitNotificationEvent('order_created', {
   *   orderId: 1,
   *   userId: 1,
   *   productName: 'Laptop'
   * });
   */
  async emitNotificationEvent(
    pattern: string,
    payload: Record<string, unknown>,
  ): Promise<MicroserviceResponse> {
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
   *
   * @param {string} pattern - The message pattern name (e.g., 'get_notifications')
   * @param {Record<string, unknown>} payload - Query data
   * @returns {Promise<any>} Response data from microservice
   *
   * @example
   * const notifications = await this.microserviceClient.sendToNotificationService('get_notifications', {
   *   userId: 1
   * });
   */
  async sendToNotificationService(
    pattern: string,
    payload: Record<string, unknown>,
  ): Promise<MicroserviceResponse> {
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
   * Emits 'order_created' event to notifications service
   *
   * @param {number} orderId - Unique order identifier
   * @param {number} userId - User who placed the order
   * @param {string} productName - Name of the product ordered
   * @returns {Promise<MicroserviceResponse>} Result from microservice
   */
  async notifyOrderCreated(
    orderId: number,
    userId: number,
    productName: string,
  ): Promise<MicroserviceResponse> {
    return this.emitNotificationEvent('order_created', {
      orderId,
      userId,
      productName,
    });
  }

  /**
   * Notify user about order completion
   * Emits 'order_completed' event to notifications service
   *
   * @param {number} orderId - ID of the completed order
   * @param {number} userId - User who should receive notification
   * @returns {Promise<MicroserviceResponse>} Result from microservice
   */
  async notifyOrderCompleted(
    orderId: number,
    userId: number,
  ): Promise<MicroserviceResponse> {
    return this.emitNotificationEvent('order_completed', {
      orderId,
      userId,
    });
  }

  /**
   * Notify user about order cancellation
   * Emits 'order_cancelled' event to notifications service
   *
   * @param {number} orderId - ID of the cancelled order
   * @param {number} userId - User who should receive notification
   * @returns {Promise<MicroserviceResponse>} Result from microservice
   */
  async notifyOrderCancelled(
    orderId: number,
    userId: number,
  ): Promise<MicroserviceResponse> {
    return this.emitNotificationEvent('order_cancelled', {
      orderId,
      userId,
    });
  }

  /**
   * Query notifications for a user from the notifications microservice
   * Sends request-reply message to get user's notifications
   *
   * @param {number} userId - The user ID to fetch notifications for
   * @returns {Promise<any>} Array of notifications for the user
   *
   * @example
   * const userNotifications = await this.getNotifications(1);
   */
  async getNotifications(userId: number): Promise<MicroserviceResponse> {
    return this.sendToNotificationService('get_notifications', { userId });
  }

  /**
   * Close the client connection when the app is shut down
   * Implements OnModuleDestroy lifecycle hook
   *
   * @returns {Promise<void>}
   */
  async onModuleDestroy(): Promise<void> {
    await this.notificationsClient.close();
  }
}
