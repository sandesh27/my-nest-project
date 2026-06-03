import { Injectable } from '@nestjs/common';
import { NotificationEvent } from './notification.interface';

/**
 * NotificationsService
 * Handles business logic for notifications
 * In a real application, this would send emails, SMS, push notifications, etc.
 *
 * @remarks
 * Currently uses in-memory storage and console logging.
 * In production, integrate with email providers (SendGrid, Mailgun) or push notification services.
 */
@Injectable()
export class NotificationsService {
  private notifications: NotificationEvent[] = [];

  /**
   * Send a notification (in a real app, this would send email, SMS, etc.)
   * Stores the notification and logs it to console
   *
   * @param {NotificationEvent} event - The notification event to send
   * @returns {NotificationEvent} The stored notification event
   *
   * @remarks
   * For production: Replace console.log with actual email/SMS/push service calls
   */
  sendNotification(event: NotificationEvent): NotificationEvent {
    this.notifications.push(event);
    console.log(`[NOTIFICATION] ${event.type}: ${event.message}`);
    return event;
  }

  /**
   * Get all notifications
   * Returns all notifications across all users
   *
   * @returns {NotificationEvent[]} Array of all notifications
   */
  getAllNotifications(): NotificationEvent[] {
    return this.notifications;
  }

  /**
   * Get notifications for a specific user
   * Filters notifications by user ID
   *
   * @param {number} userId - The user ID to filter by
   * @returns {NotificationEvent[]} Array of notifications for the user
   */
  getUserNotifications(userId: number): NotificationEvent[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  /**
   * Handle order created event
   * Creates a notification when an order is created
   *
   * @param {Object} data - Event data
   * @param {number} data.orderId - The order ID
   * @param {number} data.userId - The user who created the order
   * @param {string} data.productName - Name of the product ordered
   * @returns {NotificationEvent} The created notification
   *
   * @example
   * const notification = this.notificationsService.handleOrderCreated({
   *   orderId: 1,
   *   userId: 1,
   *   productName: 'Laptop'
   * });
   */
  handleOrderCreated(data: {
    orderId: number;
    userId: number;
    productName: string;
  }): NotificationEvent {
    const event: NotificationEvent = {
      orderId: data.orderId,
      userId: data.userId,
      message: `Your order for ${data.productName} has been created successfully!`,
      type: 'order_created',
      timestamp: new Date(),
    };
    return this.sendNotification(event);
  }

  /**
   * Handle order completed event
   * Creates a notification when an order is completed
   *
   * @param {Object} data - Event data
   * @param {number} data.orderId - The order ID
   * @param {number} data.userId - The user who placed the order
   * @returns {NotificationEvent} The created notification
   */
  handleOrderCompleted(data: {
    orderId: number;
    userId: number;
  }): NotificationEvent {
    const event: NotificationEvent = {
      orderId: data.orderId,
      userId: data.userId,
      message: `Your order #${data.orderId} has been completed!`,
      type: 'order_completed',
      timestamp: new Date(),
    };
    return this.sendNotification(event);
  }

  /**
   * Handle order cancelled event
   * Creates a notification when an order is cancelled
   *
   * @param {Object} data - Event data
   * @param {number} data.orderId - The order ID
   * @param {number} data.userId - The user who placed the order
   * @returns {NotificationEvent} The created notification
   */
  handleOrderCancelled(data: {
    orderId: number;
    userId: number;
  }): NotificationEvent {
    const event: NotificationEvent = {
      orderId: data.orderId,
      userId: data.userId,
      message: `Your order #${data.orderId} has been cancelled.`,
      type: 'order_cancelled',
      timestamp: new Date(),
    };
    return this.sendNotification(event);
  }
}
