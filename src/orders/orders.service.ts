import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './create-order.dto';
import { Order } from './order.entity';

/**
 * OrdersService
 * Handles business logic for orders
 * Uses TypeORM Repository for MySQL database persistence
 *
 * @remarks
 * This service demonstrates microservices-ready architecture with database integration.
 * All operations persist to MySQL through TypeORM.
 */
@Injectable()
export class OrdersService {
  /**
   * Constructor - Injects the Order Repository
   * TypeORM provides this repository automatically when TypeOrmModule.forFeature([Order]) is imported
   *
   * @param {Repository<Order>} orderRepository - Injected Order repository for database operations
   */
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * Create a new order
   * Saves the order to the database with initial status 'pending'
   *
   * @param {CreateOrderDto} createOrderDto - Order details from client
   * @returns {Promise<Order>} Newly created order with generated ID
   *
   * @example
   * const order = await this.ordersService.createOrder({
   *   userId: 1,
   *   productName: 'Laptop',
   *   quantity: 1,
   *   price: 999.99
   * });
   */
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create({
      ...createOrderDto,
      status: 'pending',
      createdAt: new Date(),
    });
    return this.orderRepository.save(order);
  }

  /**
   * Get all orders
   * Retrieves all orders from the database
   *
   * @returns {Promise<Order[]>} Array of all orders
   */
  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  /**
   * Get order by ID
   * Finds and returns a specific order from the database
   *
   * @param {number} id - The order ID to search for
   * @returns {Promise<Order | null>} Order if found, null otherwise
   */
  async getOrderById(id: number): Promise<Order | null> {
    return this.orderRepository.findOne({ where: { id } });
  }

  /**
   * Get orders by user ID
   * Returns all orders placed by a specific user from the database
   *
   * @param {number} userId - The user ID to filter by
   * @returns {Promise<Order[]>} Array of orders for the user
   */
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return this.orderRepository.find({ where: { userId } });
  }

  /**
   * Update order status
   * Changes the status of an existing order in the database
   * This method is often called from a microservice (e.g., notifications)
   *
   * @param {number} orderId - The order ID to update
   * @param {'pending' | 'completed' | 'cancelled'} status - New order status
   * @returns {Promise<Order | null>} Updated order if found, null otherwise
   *
   * @example
   * const updated = await this.ordersService.updateOrderStatus(1, 'completed');
   */
  async updateOrderStatus(
    orderId: number,
    status: 'pending' | 'completed' | 'cancelled',
  ): Promise<Order | null> {
    await this.orderRepository.update(orderId, { status });
    return this.getOrderById(orderId);
  }
}
