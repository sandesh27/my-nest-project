import { Injectable } from '@nestjs/common';
import { NotificationEvent } from './notification.interface';

/**
 * NotificationsService
 * Handles business logic for notifications
 * In a real application, this would send emails, SMS, push notifications, etc.
 */
@Injectable()
export class NotificationsService {
  private notifications: NotificationEvent[] = [];

  /**
   * Send a notification (in a real app, this would send email, SMS, etc.)
   */
  sendNotification(event: NotificationEvent): NotificationEvent {
    this.notifications.push(event);
    console.log(`[NOTIFICATION] ${event.type}: ${event.message}`);
    return event;
  }

  /**
   * Get all notifications
   */
  getAllNotifications(): NotificationEvent[] {
    return this.notifications;
  }

  /**
   * Get notifications for a specific user
   */
  getUserNotifications(userId: number): NotificationEvent[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  /**
   * Handle order created event
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
