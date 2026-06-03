/**
 * Order Entity
 * Represents an order in the system
 */
export class Order {
  /** Unique identifier for the order */
  id: number;

  /** User ID who placed the order */
  userId: number;

  /** Name/description of the product */
  productName: string;

  /** Quantity of items in the order */
  quantity: number;

  /** Price per unit */
  price: number;

  /** Timestamp when the order was created */
  createdAt: Date;

  /** Current status of the order: pending, completed, or cancelled */
  status: 'pending' | 'completed' | 'cancelled';
}
