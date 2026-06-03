/**
 * Notification Event Interface
 * Represents a notification event emitted when an order status changes
 */
export interface NotificationEvent {
  orderId: number;
  userId: number;
  message: string;
  type: 'order_created' | 'order_completed' | 'order_cancelled';
  timestamp: Date;
}
