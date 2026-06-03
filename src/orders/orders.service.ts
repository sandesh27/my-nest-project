import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './create-order.dto';
import { Order } from './order.entity';

/**
 * OrdersService
 * Handles business logic for orders
 * In a real application, this would interact with a database
 */
@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private orderIdCounter = 1;

  /**
   * Create a new order
   */
  createOrder(createOrderDto: CreateOrderDto): Order {
    const order: Order = {
      id: this.orderIdCounter++,
      ...createOrderDto,
      createdAt: new Date(),
      status: 'pending',
    };
    this.orders.push(order);
    return order;
  }

  /**
   * Get all orders
   */
  getAllOrders(): Order[] {
    return this.orders;
  }

  /**
   * Get order by ID
   */
  getOrderById(id: number): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }

  /**
   * Get orders by user ID
   */
  getOrdersByUserId(userId: number): Order[] {
    return this.orders.filter((order) => order.userId === userId);
  }

  /**
   * Update order status
   * This method is often called from a microservice (e.g., notifications)
   */
  updateOrderStatus(
    orderId: number,
    status: 'pending' | 'completed' | 'cancelled',
  ): Order | undefined {
    const order = this.getOrderById(orderId);
    if (order) {
      order.status = status;
    }
    return order;
  }
}
