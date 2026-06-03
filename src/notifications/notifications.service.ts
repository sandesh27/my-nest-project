import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

/**
 * NotificationsService
 * Handles business logic for notifications
 * Uses TypeORM Repository for MySQL database persistence
 *
 * @remarks
 * This service demonstrates microservices-ready architecture with database integration.
 * In production, integrate with email providers (SendGrid, Mailgun) or push notification services.
 */
@Injectable()
export class NotificationsService {
  /**
   * Constructor - Injects the Notification Repository
   * TypeORM provides this repository automatically when TypeOrmModule.forFeature([Notification]) is imported
   *
   * @param {Repository<Notification>} notificationRepository - Injected Notification repository for database operations
   */
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  /**
   * Send a notification (in a real app, this would send email, SMS, etc.)
   * Stores the notification to database and logs it to console
   *
   * @param {Notification} notification - The notification to send
   * @returns {Promise<Notification>} The stored notification record
   *
   * @remarks
   * For production: Replace console.log with actual email/SMS/push service calls
   */
  async sendNotification(notification: Notification): Promise<Notification> {
    const saved = await this.notificationRepository.save(notification);
    console.log(`[NOTIFICATION] ${notification.type}: ${notification.message}`);
    return saved;
  }

  /**
   * Get all notifications
   * Returns all notifications across all users from the database
   *
   * @returns {Promise<Notification[]>} Array of all notifications
   */
  async getAllNotifications(): Promise<Notification[]> {
    return this.notificationRepository.find();
  }

  /**
   * Get notifications for a specific user
   * Filters notifications by user ID from the database
   *
   * @param {number} userId - The user ID to filter by
   * @returns {Promise<Notification[]>} Array of notifications for the user
   */
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({ where: { userId } });
  }

  /**
   * Handle order created event
   * Creates a notification when an order is created
   *
   * @param {Object} data - Event data
   * @param {number} data.orderId - The order ID
   * @param {number} data.userId - The user who created the order
   * @param {string} data.productName - Name of the product ordered
   * @returns {Promise<Notification>} The created notification
   *
   * @example
   * const notification = await this.notificationsService.handleOrderCreated({
   *   orderId: 1,
   *   userId: 1,
   *   productName: 'Laptop'
   * });
   */
  async handleOrderCreated(data: {
    orderId: number;
    userId: number;
    productName: string;
  }): Promise<Notification> {
    const notification = this.notificationRepository.create({
      orderId: data.orderId,
      userId: data.userId,
      message: `Your order for ${data.productName} has been created successfully!`,
      type: 'order_created',
      isRead: false,
      createdAt: new Date(),
    });
    return this.sendNotification(notification);
  }

  /**
   * Handle order completed event
   * Creates a notification when an order is completed
   *
   * @param {Object} data - Event data
   * @param {number} data.orderId - The order ID
   * @param {number} data.userId - The user who placed the order
   * @returns {Promise<Notification>} The created notification
   */
  async handleOrderCompleted(data: {
    orderId: number;
    userId: number;
  }): Promise<Notification> {
    const notification = this.notificationRepository.create({
      orderId: data.orderId,
      userId: data.userId,
      message: `Your order #${data.orderId} has been completed!`,
      type: 'order_completed',
      isRead: false,
      createdAt: new Date(),
    });
    return this.sendNotification(notification);
  }

  /**
   * Handle order cancelled event
   * Creates a notification when an order is cancelled
   *
   * @param {Object} data - Event data
   * @param {number} data.orderId - The order ID
   * @param {number} data.userId - The user who placed the order
   * @returns {Promise<Notification>} The created notification
   */
  async handleOrderCancelled(data: {
    orderId: number;
    userId: number;
  }): Promise<Notification> {
    const notification = this.notificationRepository.create({
      orderId: data.orderId,
      userId: data.userId,
      message: `Your order #${data.orderId} has been cancelled.`,
      type: 'order_cancelled',
      isRead: false,
      createdAt: new Date(),
    });
    return this.sendNotification(notification);
  }
}
