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
   * Demonstrates: Creating a resource and emitting an event to a microservice
   *
   * @param {Object} body - Request body
   * @param {number} body.userId - ID of the user creating the order
   * @param {string} body.productName - Name of the product being ordered
   * @param {number} body.quantity - Quantity of the product
   * @param {number} body.price - Price per unit
   * @returns {Promise<Object>} Object with success status and created order
   *
   * @example
   * POST /example/create-order-with-notification
   * Body: {
   *   "userId": 1,
   *   "productName": "Laptop",
   *   "quantity": 1,
   *   "price": 999.99
   * }
   *
   * Response: {
   *   "success": true,
   *   "message": "Order created and notification sent",
   *   "data": {
   *     "id": 5234,
   *     "userId": 1,
   *     "productName": "Laptop",
   *     "quantity": 1,
   *     "price": 999.99,
   *     "status": "pending"
   *   }
   * }
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
  ): Promise<object> {
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
   * Demonstrates: Updating a resource status and emitting a notification event
   *
   * @param {string} orderId - ID of the order to complete
   * @returns {Promise<Object>} Object with success status and microservice response
   *
   * @example
   * POST /example/complete-order/5234
   *
   * Response: {
   *   "success": true,
   *   "message": "Order completed and user notified",
   *   "result": {}
   * }
   */
  @Post('complete-order/:orderId')
  async completeOrder(@Param('orderId') orderId: string): Promise<object> {
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
   * Demonstrates: Sending a request to a microservice and waiting for response
   *
   * @param {string} userId - ID of the user whose notifications to fetch
   * @returns {Promise<Object>} Object with success status and user's notifications
   *
   * @example
   * GET /example/user-notifications/1
   *
   * Response: {
   *   "success": true,
   *   "userId": 1,
   *   "notifications": [
   *     {
   *       "orderId": 1,
   *       "userId": 1,
   *       "message": "Your order for Laptop has been created",
   *       "type": "order_created",
   *       "timestamp": "2024-01-15T10:30:00Z"
   *     }
   *   ]
   * }
   */
  @Get('user-notifications/:userId')
  async getUserNotifications(@Param('userId') userId: string): Promise<object> {
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
   * Pattern: Update operation with cancellation event
   * Demonstrates: Updating order status and notifying through microservice
   *
   * @param {string} orderId - ID of the order to cancel
   * @returns {Promise<Object>} Object with success status
   *
   * @example
   * POST /example/cancel-order/5234
   *
   * Response: {
   *   "success": true,
   *   "message": "Order cancelled and user notified"
   * }
   */
  @Post('cancel-order/:orderId')
  async cancelOrder(@Param('orderId') orderId: string): Promise<object> {
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
   * Demonstrates: Sending arbitrary events to microservices
   *
   * @param {Object} body - Request body
   * @param {string} body.pattern - Message pattern to emit (e.g., 'custom_event')
   * @param {Record<string, unknown>} body.payload - Event payload data
   * @returns {Promise<Object>} Object with success status
   *
   * @example
   * POST /example/send-custom-event
   * Body: {
   *   "pattern": "user_registered",
   *   "payload": {
   *     "userId": 1,
   *     "email": "user@example.com",
   *     "timestamp": "2024-01-15T10:30:00Z"
   *   }
   * }
   *
   * Response: {
   *   "success": true,
   *   "message": "Event 'user_registered' sent successfully"
   * }
   */
  @Post('send-custom-event')
  async sendCustomEvent(
    @Body() body: { pattern: string; payload: Record<string, unknown> },
  ): Promise<object> {
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
   * Demonstrates: Sending a request-reply pattern to microservices
   *
   * @param {Object} body - Request body
   * @param {string} body.pattern - Message pattern to send (e.g., 'get_notifications')
   * @param {Record<string, unknown>} body.payload - Request payload data
   * @returns {Promise<Object>} Object with success status and microservice response
   *
   * @example
   * POST /example/send-custom-request
   * Body: {
   *   "pattern": "get_notifications",
   *   "payload": { "userId": 1 }
   * }
   *
   * Response: {
   *   "success": true,
   *   "message": "Request 'get_notifications' completed",
   *   "result": {
   *     "success": true,
   *     "data": [...]
   *   }
   * }
   */
  @Post('send-custom-request')
  async sendCustomRequest(
    @Body() body: { pattern: string; payload: Record<string, unknown> },
  ): Promise<object> {
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
