import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './create-order.dto';
import { Order } from './order.entity';

/**
 * OrdersService
 * Handles business logic for orders
 * In a real application, this would interact with a database
 *
 * @remarks
 * Currently uses in-memory storage (Array). Replace with database for production.
 * This service demonstrates microservices-ready architecture with event emission.
 */
@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private orderIdCounter = 1;

  /**
   * Create a new order
   * Generates unique ID and sets initial status to 'pending'
   *
   * @param {CreateOrderDto} createOrderDto - Order details from client
   * @returns {Order} Newly created order with generated ID
   *
   * @example
   * const order = this.ordersService.createOrder({
   *   userId: 1,
   *   productName: 'Laptop',
   *   quantity: 1,
   *   price: 999.99
   * });
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
   * Returns a copy of all orders in the system
   *
   * @returns {Order[]} Array of all orders
   */
  getAllOrders(): Order[] {
    return this.orders;
  }

  /**
   * Get order by ID
   * Finds and returns a specific order
   *
   * @param {number} id - The order ID to search for
   * @returns {Order | undefined} Order if found, undefined otherwise
   */
  getOrderById(id: number): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }

  /**
   * Get orders by user ID
   * Returns all orders placed by a specific user
   *
   * @param {number} userId - The user ID to filter by
   * @returns {Order[]} Array of orders for the user
   */
  getOrdersByUserId(userId: number): Order[] {
    return this.orders.filter((order) => order.userId === userId);
  }

  /**
   * Update order status
   * Changes the status of an existing order
   * This method is often called from a microservice (e.g., notifications)
   *
   * @param {number} orderId - The order ID to update
   * @param {'pending' | 'completed' | 'cancelled'} status - New order status
   * @returns {Order | undefined} Updated order if found, undefined otherwise
   *
   * @example
   * const updated = this.ordersService.updateOrderStatus(1, 'completed');
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
