import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './create-order.dto';

/**
 * OrdersController
 * Handles HTTP requests and microservice messages for orders
 * This controller demonstrates both REST API and microservice communication patterns
 */
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * HTTP endpoint: Create a new order
   * Creates a new order with the provided details
   * POST /orders
   *
   * @param {CreateOrderDto} createOrderDto - Order creation data
   * @returns {Object} Object with success message and created order data
   *
   * @example
   * POST /orders
   * Body: {
   *   "userId": 1,
   *   "productName": "Laptop",
   *   "quantity": 1,
   *   "price": 999.99
   * }
   *
   * Response: {
   *   "message": "Order created successfully",
   *   "data": {
   *     "id": 1,
   *     "userId": 1,
   *     "productName": "Laptop",
   *     "quantity": 1,
   *     "price": 999.99,
   *     "createdAt": "2024-01-15T10:30:00Z",
   *     "status": "pending"
   *   }
   * }
   */
  @Post()
  create(@Body() createOrderDto: CreateOrderDto): object {
    const order = this.ordersService.createOrder(createOrderDto);
    return {
      message: 'Order created successfully',
      data: order,
    };
  }

  /**
   * HTTP endpoint: Get all orders
   * Retrieves all orders in the system
   * GET /orders
   *
   * @returns {Object} Object with data property containing array of all orders
   *
   * @example
   * GET /orders
   * Response: {
   *   "data": [
   *     {"id": 1, "userId": 1, "productName": "Laptop", "quantity": 1, "price": 999.99, "status": "pending"},
   *     {"id": 2, "userId": 2, "productName": "Mouse", "quantity": 2, "price": 29.99, "status": "completed"}
   *   ]
   * }
   */
  @Get()
  getAllOrders(): object {
    return {
      data: this.ordersService.getAllOrders(),
    };
  }

  /**
   * HTTP endpoint: Get order by ID
   * Retrieves a single order by its ID
   * GET /orders/:id
   *
   * @param {string} id - The order ID
   * @returns {Object} Object with data property containing the order or not found message
   *
   * @example
   * GET /orders/1
   * Response: {
   *   "data": {
   *     "id": 1,
   *     "userId": 1,
   *     "productName": "Laptop",
   *     "quantity": 1,
   *     "price": 999.99,
   *     "status": "pending"
   *   }
   * }
   */
  @Get(':id')
  getOrderById(@Param('id') id: string): object {
    const order = this.ordersService.getOrderById(parseInt(id));
    return {
      data: order || { message: 'Order not found' },
    };
  }

  /**
   * HTTP endpoint: Get orders by user ID
   * Retrieves all orders belonging to a specific user
   * GET /orders/user/:userId
   *
   * @param {string} userId - The user ID to filter orders by
   * @returns {Object} Object with data property containing array of user's orders
   *
   * @example
   * GET /orders/user/1
   * Response: {
   *   "data": [
   *     {"id": 1, "userId": 1, "productName": "Laptop", "quantity": 1, "price": 999.99, "status": "pending"},
   *     {"id": 3, "userId": 1, "productName": "Keyboard", "quantity": 1, "price": 79.99, "status": "completed"}
   *   ]
   * }
   */
  @Get('user/:userId')
  getOrdersByUserId(@Param('userId') userId: string): object {
    return {
      data: this.ordersService.getOrdersByUserId(parseInt(userId)),
    };
  }

  /**
   * Microservice message handler: update_order_status
   * Updates the status of an order via microservice message pattern
   * This is called from other microservices via TCP communication
   * Pattern-based messaging allows services to communicate without HTTP
   *
   * @param {Object} data - Message data
   * @param {number} data.orderId - The order ID to update
   * @param {string} data.status - The new status ('pending' | 'completed' | 'cancelled')
   * @returns {Object} Object with success flag and updated order data
   *
   * @example
   * Message Pattern 'update_order_status'
   * Input: {"orderId": 1, "status": "completed"}
   * Response: {
   *   "success": true,
   *   "data": {"id": 1, "userId": 1, "productName": "Laptop", "status": "completed"}
   * }
   */
  @MessagePattern('update_order_status')
  handleUpdateOrderStatus(data: { orderId: number; status: string }): object {
    const updatedOrder = this.ordersService.updateOrderStatus(
      data.orderId,
      data.status as 'pending' | 'completed' | 'cancelled',
    );
    return {
      success: !!updatedOrder,
      data: updatedOrder,
    };
  }

  /**
   * Microservice message handler: get_order
   * Allows other microservices to query order details
   * Used for inter-service communication to fetch order information
   *
   * @param {Object} data - Message data
   * @param {number} data.orderId - The order ID to retrieve
   * @returns {Object} Object with success flag and order data
   *
   * @example
   * Message Pattern 'get_order'
   * Input: {"orderId": 1}
   * Response: {
   *   "success": true,
   *   "data": {"id": 1, "userId": 1, "productName": "Laptop", "quantity": 1, "price": 999.99, "status": "pending"}
   * }
   */
  @MessagePattern('get_order')
  handleGetOrder(data: { orderId: number }): object {
    const order = this.ordersService.getOrderById(data.orderId);
    return {
      success: !!order,
      data: order,
    };
  }
}
