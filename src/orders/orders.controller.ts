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
   * POST /orders
   */
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    const order = this.ordersService.createOrder(createOrderDto);
    return {
      message: 'Order created successfully',
      data: order,
    };
  }

  /**
   * HTTP endpoint: Get all orders
   * GET /orders
   */
  @Get()
  getAllOrders() {
    return {
      data: this.ordersService.getAllOrders(),
    };
  }

  /**
   * HTTP endpoint: Get order by ID
   * GET /orders/:id
   */
  @Get(':id')
  getOrderById(@Param('id') id: string) {
    const order = this.ordersService.getOrderById(parseInt(id));
    return {
      data: order || { message: 'Order not found' },
    };
  }

  /**
   * HTTP endpoint: Get orders by user ID
   * GET /orders/user/:userId
   */
  @Get('user/:userId')
  getOrdersByUserId(@Param('userId') userId: string) {
    return {
      data: this.ordersService.getOrdersByUserId(parseInt(userId)),
    };
  }

  /**
   * Microservice message handler: update_order_status
   * This is called from other microservices via TCP/RabbitMQ
   * Pattern-based messaging allows services to communicate without HTTP
   */
  @MessagePattern('update_order_status')
  handleUpdateOrderStatus(data: { orderId: number; status: string }) {
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
   * Allows other microservices to query orders
   */
  @MessagePattern('get_order')
  handleGetOrder(data: { orderId: number }) {
    const order = this.ordersService.getOrderById(data.orderId);
    return {
      success: !!order,
      data: order,
    };
  }
}
