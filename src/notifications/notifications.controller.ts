import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

/**
 * NotificationsController
 * Handles both HTTP requests (for the main app) and microservice messages
 * This can run as a standalone microservice or be embedded in the main app
 */
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * HTTP endpoint: Get all notifications
   * GET /notifications
   */
  @Get()
  getAllNotifications() {
    return {
      data: this.notificationsService.getAllNotifications(),
    };
  }

  /**
   * HTTP endpoint: Get notifications for a user
   * GET /notifications/user/:userId
   */
  @Get('user/:userId')
  getUserNotifications(@Param('userId') userId: string) {
    return {
      data: this.notificationsService.getUserNotifications(parseInt(userId)),
    };
  }

  /**
   * Microservice message handler: order_created
   * Listens for order creation events from other microservices
   */
  @MessagePattern('order_created')
  handleOrderCreated(data: {
    orderId: number;
    userId: number;
    productName: string;
  }) {
    const notification = this.notificationsService.handleOrderCreated(data);
    return {
      success: true,
      message: 'Notification sent',
      data: notification,
    };
  }

  /**
   * Microservice message handler: order_completed
   * Listens for order completion events
   */
  @MessagePattern('order_completed')
  handleOrderCompleted(data: { orderId: number; userId: number }) {
    const notification = this.notificationsService.handleOrderCompleted(data);
    return {
      success: true,
      message: 'Notification sent',
      data: notification,
    };
  }

  /**
   * Microservice message handler: order_cancelled
   * Listens for order cancellation events
   */
  @MessagePattern('order_cancelled')
  handleOrderCancelled(data: { orderId: number; userId: number }) {
    const notification = this.notificationsService.handleOrderCancelled(data);
    return {
      success: true,
      message: 'Notification sent',
      data: notification,
    };
  }

  /**
   * Microservice message handler: get_notifications
   * Allows other services to query notifications
   */
  @MessagePattern('get_notifications')
  handleGetNotifications(data: { userId: number }) {
    const notifications = this.notificationsService.getUserNotifications(
      data.userId,
    );
    return {
      success: true,
      data: notifications,
    };
  }
}
