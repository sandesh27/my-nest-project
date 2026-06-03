import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Order Entity
 * Represents an order in the system
 * Table: orders
 */
@Entity('orders')
export class Order {
  /** Unique identifier for the order (Auto-incremented) */
  @PrimaryGeneratedColumn()
  id: number;

  /** User ID who placed the order */
  @Column()
  userId: number;

  /** Name/description of the product */
  @Column()
  productName: string;

  /** Quantity of items in the order */
  @Column({ default: 1 })
  quantity: number;

  /** Price per unit */
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  /** Timestamp when the order was created */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /** Current status of the order: pending, completed, or cancelled */
  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'completed' | 'cancelled';
}
