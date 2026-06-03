/**
 * MICROSERVICES INTEGRATION EXAMPLE
 *
 * This file demonstrates how to integrate microservice communication
 * into your existing controllers and services.
 *
 * How to use this example:
 * 1. Inject MicroserviceClientService into your controller/service
 * 2. Call the methods to emit events or query other services
 * 3. The microservices will receive and process the messages
 */

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MicroserviceClientService } from '../src/common/microservice-client.service';

/**
 * Example Controller showing Microservices Integration
 * This demonstrates best practices for calling microservices
 */
@Controller('example')
export class ExampleMicroservicesController {
  // Inject the microservice client
  constructor(private readonly microserviceClient: MicroserviceClientService) {}

  /**
   * Example 1: Create an order and notify the user
   * Pattern: HTTP request triggers microservice event
   */
  @Post('create-order-with-notification')
  async createOrderWithNotification(
    @Body()
    body: {
      userId: number;
      productName: string;
      quantity: number;
      price: number;
    },
  ) {
    try {
      // Step 1: Create the order (in a real app, save to database)
      const orderId = Math.floor(Math.random() * 10000);
      const order = {
        id: orderId,
        userId: body.userId,
        productName: body.productName,
        quantity: body.quantity,
        price: body.price,
        createdAt: new Date(),
        status: 'pending',
      };

      console.log('✅ Order created:', order);

      // Step 2: Emit notification event to microservice
      // The notifications service will receive this event on pattern 'order_created'
      await this.microserviceClient.notifyOrderCreated(
        orderId,
        body.userId,
        body.productName,
      );

      return {
        success: true,
        message: 'Order created and notification sent',
        data: order,
      };
    } catch (error) {
      console.error('❌ Error creating order:', error);
      return {
        success: false,
        message: 'Failed to create order',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Example 2: Complete an order and notify user
   * Pattern: Update operation triggers notification
   */
  @Post('complete-order/:orderId')
  async completeOrder(@Param('orderId') orderId: string) {
    try {
      const id = parseInt(orderId);

      // Step 1: Update order status (in a real app, update database)
      console.log(`🔄 Updating order ${id} status to completed`);

      // Step 2: Emit completion notification
      // The notifications service will receive this on pattern 'order_completed'
      const result = await this.microserviceClient.notifyOrderCompleted(
        id,
        1, // userId - in real app, get from database
      );

      return {
        success: true,
        message: 'Order completed and user notified',
        result,
      };
    } catch (error) {
      console.error('❌ Error completing order:', error);
      return {
        success: false,
        message: 'Failed to complete order',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Example 3: Query notifications from another microservice
   * Pattern: Request-reply for data retrieval
   */
  @Get('user-notifications/:userId')
  async getUserNotifications(@Param('userId') userId: string) {
    try {
      const id = parseInt(userId);

      // Send a request to the notifications service
      // and wait for the response
      const result = await this.microserviceClient.getNotifications(id);

      return {
        success: true,
        userId: id,
        notifications: result,
      };
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      return {
        success: false,
        message: 'Failed to fetch notifications',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Example 4: Cancel an order
   */
  @Post('cancel-order/:orderId')
  async cancelOrder(@Param('orderId') orderId: string) {
    try {
      const id = parseInt(orderId);

      // Update order status
      console.log(`❌ Cancelling order ${id}`);

      // Emit cancellation notification
      await this.microserviceClient.notifyOrderCancelled(
        id,
        1, // userId
      );

      return {
        success: true,
        message: 'Order cancelled and user notified',
      };
    } catch (error) {
      console.error('❌ Error cancelling order:', error);
      return {
        success: false,
        message: 'Failed to cancel order',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Example 5: Emit custom event
   * Pattern: Direct event emission for custom logic
   */
  @Post('send-custom-event')
  async sendCustomEvent(
    @Body() body: { pattern: string; payload: Record<string, unknown> },
  ) {
    try {
      // You can emit any custom event to any microservice
      await this.microserviceClient.emitNotificationEvent(
        body.pattern,
        body.payload,
      );

      return {
        success: true,
        message: `Event '${body.pattern}' sent successfully`,
      };
    } catch (error) {
      console.error('❌ Error sending event:', error);
      return {
        success: false,
        message: 'Failed to send event',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Example 6: Send custom request to microservice
   * Pattern: Query any data from microservices
   */
  @Post('send-custom-request')
  async sendCustomRequest(
    @Body() body: { pattern: string; payload: Record<string, unknown> },
  ) {
    try {
      // Send a request and wait for response
      const result = await this.microserviceClient.sendToNotificationService(
        body.pattern,
        body.payload,
      );

      return {
        success: true,
        message: `Request '${body.pattern}' completed`,
        result,
      };
    } catch (error) {
      console.error('❌ Error sending request:', error);
      return {
        success: false,
        message: 'Failed to send request',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

/**
 * HOW TO USE THESE EXAMPLES:
 *
 * 1. Add ExampleMicroservicesController to your app.module.ts:
 *    import { ExampleMicroservicesController } from './path/to/this/file';
 *
 * 2. Register in AppModule:
 *    @Module({
 *      controllers: [ExampleMicroservicesController],
 *      // ... rest of module config
 *    })
 *
 * 3. Test the endpoints using curl or Postman:
 *
 *    # Create order with notification
 *    curl -X POST http://localhost:3000/example/create-order-with-notification \
 *      -H "Content-Type: application/json" \
 *      -d '{
 *        "userId": 1,
 *        "productName": "Laptop",
 *        "quantity": 1,
 *        "price": 999.99
 *      }'
 *
 *    # Complete order
 *    curl -X POST http://localhost:3000/example/complete-order/1
 *
 *    # Get user notifications
 *    curl http://localhost:3000/example/user-notifications/1
 *
 *    # Cancel order
 *    curl -X POST http://localhost:3000/example/cancel-order/1
 *
 * 4. Watch the console output to see:
 *    - Order creation logs
 *    - Microservice communication logs
 *    - Notification processing logs
 */
