import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Notification Entity
 * Represents a notification record in the database
 * Table: notifications
 */
@Entity('notifications')
export class Notification {
  /** Unique identifier for the notification (Auto-incremented) */
  @PrimaryGeneratedColumn()
  id: number;

  /** ID of the order that triggered the notification */
  @Column()
  orderId: number;

  /** ID of the user who should receive the notification */
  @Column()
  userId: number;

  /** The notification message to display */
  @Column('text')
  message: string;

  /** Type of notification: order_created, order_completed, or order_cancelled */
  @Column({
    type: 'enum',
    enum: [
      'order_created',
      'order_completed',
      'order_cancelled',
      'order_updated',
    ],
    default: 'order_created',
  })
  type:
    | 'order_created'
    | 'order_completed'
    | 'order_cancelled'
    | 'order_updated';

  /** Whether the notification has been read by the user */
  @Column({ default: false })
  isRead: boolean;

  /** Timestamp when the notification was created */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /** Timestamp when the notification was last updated */
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
