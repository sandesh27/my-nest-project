/**
 * Notification Event Interface
 * Represents a notification event emitted when an order status changes
 */
export interface NotificationEvent {
  /** ID of the order that triggered the notification */
  orderId: number;

  /** ID of the user who should receive the notification */
  userId: number;

  /** The notification message to display */
  message: string;

  /** Type of notification: order_created, order_completed, or order_cancelled */
  type: 'order_created' | 'order_completed' | 'order_cancelled';

  /** Timestamp when the notification was created */
  timestamp: Date;
}
