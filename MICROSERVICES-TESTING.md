# Microservices Testing Guide

This guide provides ready-to-use API requests for testing the microservices architecture.

## Prerequisites

✅ Main app running: `npm run start:dev` (port 3000)
✅ Notifications microservice running: `npx ts-node apps/notifications-service/main.ts` (port 3001)

## API Requests

### 1. Orders API

#### Create an Order

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "productName": "MacBook Pro",
    "quantity": 1,
    "price": 1999.99
  }'
```

Response:

```json
{
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "productName": "MacBook Pro",
    "quantity": 1,
    "price": 1999.99,
    "createdAt": "2025-06-04T10:30:00.000Z",
    "status": "pending"
  }
}
```

#### Get All Orders

```bash
curl http://localhost:3000/orders
```

#### Get Order by ID

```bash
curl http://localhost:3000/orders/1
```

#### Get Orders by User ID

```bash
curl http://localhost:3000/orders/user/1
```

### 2. Notifications API

#### Get All Notifications

```bash
curl http://localhost:3000/notifications
```

#### Get Notifications for Specific User

```bash
curl http://localhost:3000/notifications/user/1
```

Response:

```json
{
  "data": [
    {
      "orderId": 1,
      "userId": 1,
      "message": "Your order for MacBook Pro has been created successfully!",
      "type": "order_created",
      "timestamp": "2025-06-04T10:30:00.000Z"
    }
  ]
}
```

### 3. Example Integration Endpoints

#### Create Order with Notification

```bash
curl -X POST http://localhost:3000/example/create-order-with-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "productName": "iPhone 15",
    "quantity": 1,
    "price": 999.99
  }'
```

#### Complete Order (Sends Notification)

```bash
curl -X POST http://localhost:3000/example/complete-order/1
```

This will:

1. Update order status to "completed"
2. Send notification to notifications service
3. Notify user about order completion

#### Cancel Order

```bash
curl -X POST http://localhost:3000/example/cancel-order/1
```

#### Get User Notifications

```bash
curl http://localhost:3000/example/user-notifications/1
```

#### Send Custom Event

```bash
curl -X POST http://localhost:3000/example/send-custom-event \
  -H "Content-Type: application/json" \
  -d '{
    "pattern": "order_created",
    "payload": {
      "orderId": 100,
      "userId": 5,
      "productName": "Custom Product"
    }
  }'
```

#### Send Custom Request

```bash
curl -X POST http://localhost:3000/example/send-custom-request \
  -H "Content-Type: application/json" \
  -d '{
    "pattern": "get_notifications",
    "payload": {
      "userId": 1
    }
  }'
```

## Expected Console Output

When you create an order with notification, you should see:

**Main App Console:**

```
✅ Order created: {
  id: 1,
  userId: 1,
  productName: "MacBook Pro",
  quantity: 1,
  price: 1999.99,
  createdAt: 2025-06-04T10:30:00.000Z,
  status: 'pending'
}
Event 'order_created' sent successfully: undefined
```

**Notifications Service Console:**

```
🔔 Notifications Microservice is listening on port 3001...
[NOTIFICATION] order_created: Your order for MacBook Pro has been created successfully!
```

## Complete Flow Example

### Scenario: Customer Places Order → Gets Notification

1. **Create Order Request:**

   ```bash
   POST http://localhost:3000/example/create-order-with-notification
   Body: { "userId": 1, "productName": "Laptop", "quantity": 1, "price": 999.99 }
   ```

2. **Main App Processing:**
   - Creates order and saves to MySQL database via Repository
   - Extracts order details (orderId, userId, productName)
   - Calls `microserviceClient.notifyOrderCreated()`

3. **TCP Communication:**
   - Main app sends message to notifications service on port 3001
   - Pattern: `order_created`
   - Payload: `{ orderId, userId, productName }`

4. **Notifications Service Processing:**
   - Receives message pattern `order_created`
   - Triggered `@MessagePattern('order_created')` handler
   - `handleOrderCreated()` creates notification
   - In real app: sends email/SMS/push notification

5. **Response:**

   ```json
   {
     "success": true,
     "message": "Order created and notification sent",
     "data": { order details }
   }
   ```

6. **Verify Notifications:**
   ```bash
   GET http://localhost:3000/notifications/user/1
   ```
   Returns all notifications for user 1

## Microservice Message Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Request                           │
│        POST /example/create-order-with-notification        │
└────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Main App        │
                    │  OrdersService   │
                    └────────┬─────────┘
                             │
                    ✅ Create Order
                             │
                             ▼
            ┌────────────────────────────────┐
            │ MicroserviceClient             │
            │ .notifyOrderCreated()          │
            │ .emitNotificationEvent()       │
            └────────────┬───────────────────┘
                         │
          TCP Connect to localhost:3001
                         │
                         ▼
         [Message: 'order_created', payload]
                         │
                         ▼
        ┌──────────────────────────────────┐
        │ Notifications Microservice       │
        │ TCP Listener (port 3001)         │
        └────────────┬─────────────────────┘
                     │
          📨 @MessagePattern('order_created')
                     │
                     ▼
        ┌──────────────────────────────────┐
        │ handleOrderCreated()             │
        │ - Create notification event      │
        │ - Log message                    │
        │ - Store notification             │
        └──────────────────────────────────┘
                     │
                     ▼
            Response to Main App
                     │
                     ▼
        ┌──────────────────────────────────┐
        │ Return HTTP 200 OK               │
        │ {                                │
        │   "success": true,               │
        │   "message": "Order created..."  │
        │ }                                │
        └──────────────────────────────────┘
```

## Troubleshooting

### Issue: `Cannot connect to localhost:3001`

- Ensure notifications microservice is running
- Check that port 3001 is not blocked by firewall
- Verify TCP transport is configured correctly

### Issue: Messages not being received

- Check that `@MessagePattern` decorator matches the pattern name
- Verify both microservices are using TCP transport
- Check console logs for connection errors

### Issue: Timeout errors

- Increase timeout in `microservice-client.service.ts`
- Verify microservice is running and responsive
- Check network connectivity

## Next Steps

1. **Add RabbitMQ:** Replace TCP with RabbitMQ for production-grade message queuing
2. ✅ **Database Integration:** Orders and Notifications now use MySQL with TypeORM
3. **Add Authentication:** Secure microservice communication
4. **Add Error Handling:** Implement retry logic and circuit breakers
5. **Add Logging:** Integrate Winston or Pino for structured logging
6. **Add Monitoring:** Use Prometheus/Grafana for observability
