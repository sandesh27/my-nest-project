import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { NotificationEvent } from './notification.interface';

/**
 * Response interfaces for type safety
 */
interface NotificationDataResponse {
  data: NotificationEvent[];
}

interface NotificationHandlerResponse {
  success: boolean;
  message: string;
  data: NotificationEvent;
}

interface NotificationsQueryResponse {
  success: boolean;
  data: NotificationEvent[];
}

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
   * Returns all notifications across all users in the system
   * GET /notifications
   *
   * @returns {Object} Object with data property containing array of all notifications
   * @example
   * GET /notifications
   * Response: {
   *   "data": [
   *     {"orderId": 1, "userId": 1, "message": "Order created", "type": "order_created", "timestamp": "2024-01-15T10:30:00Z"}
   *   ]
   * }
   */
  @Get()
  getAllNotifications(): object {
    return {
      data: this.notificationsService.getAllNotifications(),
    };
  }

  /**
   * HTTP endpoint: Get notifications for a user
   * Returns all notifications created for a specific user
   * GET /notifications/user/:userId
   *
   * @param {string} userId - The user ID to fetch notifications for
   * @returns {Object} Object with data property containing array of user's notifications
   * @example
   * GET /notifications/user/1
   * Response: {
   *   "data": [
   *     {"orderId": 1, "userId": 1, "message": "Order created", "type": "order_created", "timestamp": "2024-01-15T10:30:00Z"}
   *   ]
   * }
   */
  @Get('user/:userId')
  getUserNotifications(@Param('userId') userId: string): object {
    return {
      data: this.notificationsService.getUserNotifications(parseInt(userId)),
    };
  }

  /**
   * Microservice message handler: order_created
   * Listens for order creation events from other microservices
   * This handler is called when an order is created in the Orders service
   *
   * @param {Object} data - Event data
   * @param {number} data.orderId - The created order ID
   * @param {number} data.userId - The user who created the order
   * @param {string} data.productName - Name of the ordered product
   * @returns {Object} Response object with success status and created notification
   *
   * @example
   * Message Pattern 'order_created'
   * Input: {"orderId": 1, "userId": 1, "productName": "Laptop"}
   * Response: {
   *   "success": true,
   *   "message": "Notification sent",
   *   "data": {"orderId": 1, "userId": 1, "message": "Your order for Laptop has been created", "type": "order_created"}
   * }
   */
  @MessagePattern('order_created')
  handleOrderCreated(data: {
    orderId: number;
    userId: number;
    productName: string;
  }): object {
    const notification = this.notificationsService.handleOrderCreated(data);
    return {
      success: true,
      message: 'Notification sent',
      data: notification,
    };
  }

  /**
   * Microservice message handler: order_completed
   * Listens for order completion events from other microservices
   * This handler is called when an order status is updated to 'completed'
   *
   * @param {Object} data - Event data
   * @param {number} data.orderId - The completed order ID
   * @param {number} data.userId - The user who placed the order
   * @returns {Object} Response object with success status and created notification
   */
  @MessagePattern('order_completed')
  handleOrderCompleted(data: { orderId: number; userId: number }): object {
    const notification = this.notificationsService.handleOrderCompleted(data);
    return {
      success: true,
      message: 'Notification sent',
      data: notification,
    };
  }

  /**
   * Microservice message handler: order_cancelled
   * Listens for order cancellation events from other microservices
   * This handler is called when an order status is updated to 'cancelled'
   *
   * @param {Object} data - Event data
   * @param {number} data.orderId - The cancelled order ID
   * @param {number} data.userId - The user who placed the order
   * @returns {Object} Response object with success status and created notification
   */
  @MessagePattern('order_cancelled')
  handleOrderCancelled(data: { orderId: number; userId: number }): object {
    const notification = this.notificationsService.handleOrderCancelled(data);
    return {
      success: true,
      message: 'Notification sent',
      data: notification,
    };
  }

  /**
   * Microservice message handler: get_notifications
   * Allows other microservices to query notifications for a specific user
   * Used by other services to fetch user notifications
   *
   * @param {Object} data - Query data
   * @param {number} data.userId - The user ID to fetch notifications for
   * @returns {Object} Response object with success status and array of notifications
   *
   * @example
   * Message Pattern 'get_notifications'
   * Input: {"userId": 1}
   * Response: {
   *   "success": true,
   *   "data": [
   *     {"orderId": 1, "userId": 1, "message": "Order created", "type": "order_created"}
   *   ]
   * }
   */
  @MessagePattern('get_notifications')
  handleGetNotifications(data: { userId: number }): object {
    const notifications = this.notificationsService.getUserNotifications(
      data.userId,
    );
    return {
      success: true,
      data: notifications,
    };
  }
}
