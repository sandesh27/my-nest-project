/**
 * Order Entity
 * Represents an order in the system
 */
export class Order {
  id: number;
  userId: number;
  productName: string;
  quantity: number;
  price: number;
  createdAt: Date;
  status: 'pending' | 'completed' | 'cancelled';
}
