import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification.entity';

/**
 * Response interfaces for type safety
 */
interface NotificationDataResponse {
  data: Notification[];
}

interface NotificationHandlerResponse {
  success: boolean;
  message: string;
  data: Notification;
}

interface NotificationsQueryResponse {
  success: boolean;
  data: Notification[];
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
   * @returns {Promise<NotificationDataResponse>} Promise resolving to object with data property containing array of all notifications
   * @example
   * GET /notifications
   * Response: {
   *   "data": [
   *     {"id": 1, "orderId": 1, "userId": 1, "message": "Order created", "type": "order_created", "createdAt": "2024-01-15T10:30:00Z"}
   *   ]
   * }
   */
  @Get()
  async getAllNotifications(): Promise<NotificationDataResponse> {
    return {
      data: await this.notificationsService.getAllNotifications(),
    };
  }

  /**
   * HTTP endpoint: Get notifications for a user
   * Returns all notifications created for a specific user
   * GET /notifications/user/:userId
   *
   * @param {string} userId - The user ID to fetch notifications for
   * @returns {Promise<NotificationDataResponse>} Promise resolving to object with data property containing array of user's notifications
   * @example
   * GET /notifications/user/1
   * Response: {
   *   "data": [
   *     {"id": 1, "orderId": 1, "userId": 1, "message": "Order created", "type": "order_created", "createdAt": "2024-01-15T10:30:00Z"}
   *   ]
   * }
   */
  @Get('user/:userId')
  async getUserNotifications(
    @Param('userId') userId: string,
  ): Promise<NotificationDataResponse> {
    return {
      data: await this.notificationsService.getUserNotifications(
        parseInt(userId),
      ),
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
   * @returns {Promise<NotificationHandlerResponse>} Promise resolving to response object with success status and created notification
   *
   * @example
   * Message Pattern 'order_created'
   * Input: {"orderId": 1, "userId": 1, "productName": "Laptop"}
   * Response: {
   *   "success": true,
   *   "message": "Notification sent",
   *   "data": {"id": 1, "orderId": 1, "userId": 1, "message": "Your order for Laptop has been created", "type": "order_created"}
   * }
   */
  @MessagePattern('order_created')
  async handleOrderCreated(data: {
    orderId: number;
    userId: number;
    productName: string;
  }): Promise<NotificationHandlerResponse> {
    const notification =
      await this.notificationsService.handleOrderCreated(data);
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
   * @returns {Promise<NotificationHandlerResponse>} Promise resolving to response object with success status and created notification
   */
  @MessagePattern('order_completed')
  async handleOrderCompleted(data: {
    orderId: number;
    userId: number;
  }): Promise<NotificationHandlerResponse> {
    const notification =
      await this.notificationsService.handleOrderCompleted(data);
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
   * @returns {Promise<NotificationHandlerResponse>} Promise resolving to response object with success status and created notification
   */
  @MessagePattern('order_cancelled')
  async handleOrderCancelled(data: {
    orderId: number;
    userId: number;
  }): Promise<NotificationHandlerResponse> {
    const notification =
      await this.notificationsService.handleOrderCancelled(data);
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
   * @returns {Promise<NotificationsQueryResponse>} Promise resolving to response object with success status and array of notifications
   *
   * @example
   * Message Pattern 'get_notifications'
   * Input: {"userId": 1}
   * Response: {
   *   "success": true,
   *   "data": [
   *     {"id": 1, "orderId": 1, "userId": 1, "message": "Order created", "type": "order_created"}
   *   ]
   * }
   */
  @MessagePattern('get_notifications')
  async handleGetNotifications(data: {
    userId: number;
  }): Promise<NotificationsQueryResponse> {
    const notifications = await this.notificationsService.getUserNotifications(
      data.userId,
    );
    return {
      success: true,
      data: notifications,
    };
  }
}
