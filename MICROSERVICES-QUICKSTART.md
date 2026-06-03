# Microservices Quick Start Guide

## What Was Added?

✨ Complete microservices architecture with:

- ✅ Orders Module (HTTP + Message-based)
- ✅ Notifications Module (HTTP + Message-based)
- ✅ Standalone Notifications Microservice
- ✅ Microservice Client Service
- ✅ Example Integration Controller
- ✅ Comprehensive Documentation

## File Structure

```
src/
├── common/
│   └── microservice-client.service.ts    # ⭐ Client for inter-service communication
├── orders/                               # ⭐ NEW: Orders feature
│   ├── create-order.dto.ts
│   ├── order.entity.ts
│   ├── orders.controller.ts   # HTTP endpoints + Message handlers
│   ├── orders.module.ts
│   └── orders.service.ts
├── notifications/                        # ⭐ NEW: Notifications feature
│   ├── notification.interface.ts
│   ├── notifications.controller.ts   # HTTP endpoints + Message handlers
│   ├── notifications.module.ts
│   └── notifications.service.ts
├── example-microservices-integration.controller.ts  # ⭐ NEW: Examples
├── app.module.ts                         # ✏️ UPDATED: Added Orders & Notifications
└── main.ts

apps/
└── notifications-service/                # ⭐ NEW: Standalone microservice
    ├── main.ts             # Entry point (TCP on port 3001)
    └── notifications-microservice.module.ts

Documentation:
├── MICROSERVICES.md                      # Complete architecture guide
├── MICROSERVICES-TESTING.md              # API testing guide
└── MICROSERVICES-QUICKSTART.md           # This file
```

## Installation

### 1. Install Microservices Dependency (if not already installed)

```bash
npm install @nestjs/microservices
```

This package is already in your dependencies, but if you need to add it:

```bash
npm install @nestjs/microservices
```

### 2. No additional setup needed! 🎉

The microservices are configured and ready to use.

## Running the Microservices

### Option 1: Run Everything in One Terminal (Easy)

```bash
# Terminal 1: Start the main application
npm run start:dev
# Expected output: "Listening on port 3000"
```

Then in another terminal:

```bash
# Terminal 2: Start the notifications microservice
npx ts-node apps/notifications-service/main.ts
# Expected output: "🔔 Notifications Microservice is listening on port 3001..."
```

### Option 2: Run Integrated (Main App Only)

```bash
npm run start:dev
# The main app has the orders and notifications modules embedded
```

## Testing the Microservices

### Test 1: Create an Order

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

Expected response:

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

### Test 2: Get All Orders

```bash
curl http://localhost:3000/orders
```

### Test 3: Get Notifications

```bash
curl http://localhost:3000/notifications/user/1
```

### Test 4: Create Order with Notification (Example Integration)

```bash
curl -X POST http://localhost:3000/example/create-order-with-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "productName": "iPhone 15",
    "quantity": 1,
    "price": 999.99
  }'
```

**Watch the Console Output:**

**Main App Console:**

```
✅ Order created: { id: 1, userId: 1, productName: "iPhone 15", ... }
Event 'order_created' sent successfully: undefined
```

**Notifications Service Console:**

```
[NOTIFICATION] order_created: Your order for iPhone 15 has been created successfully!
```

See the communication happening? 🎉

## How It Works

### 1. Simple Architecture

```
HTTP Request → Controller → Service → Microservice Event → Notifications Service
```

### 2. Example Flow: Create Order → Send Notification

```javascript
// 1. User sends HTTP request
POST /orders { userId: 1, productName: "Laptop", ... }

// 2. OrdersController receives request
@Post()
create(@Body() createOrderDto) { ... }

// 3. OrdersService creates order
this.ordersService.createOrder(createOrderDto)

// 4. Emit event to notification service
await this.microserviceClient.notifyOrderCreated(orderId, userId, productName)

// 5. Notifications microservice receives event
@MessagePattern('order_created')
handleOrderCreated(data) { ... }

// 6. Create notification
this.notificationsService.handleOrderCreated(data)

// 7. Return success to user
{ success: true, data: order, message: "Order created?" }
```

## Key Concepts

### 1. **Message Patterns**

Event names that microservices listen for:

- `order_created` - Fired when a new order is created
- `order_completed` - Fired when order is completed
- `order_cancelled` - Fired when order is cancelled
- `get_notifications` - Query notifications

### 2. **TCP Transport**

Services communicate via TCP protocol:

- Main app connects to notifications service on `localhost:3001`
- Direct, fast, point-to-point communication in local network

### 3. **Request-Reply vs Event**

- **Event (emit):** Fire and forget (notifications don't need immediate response)
- **Request (send):** Expect response (querying data from other services)

### 4. **Embedded vs Standalone**

- **Embedded:** Notifications module runs in main app (port 3000)
- **Standalone:** Notifications microservice runs separately (port 3001)

## Code Examples

### Example 1: Emit Event from Controller

```typescript
// In your controller
constructor(private microserviceClient: MicroserviceClientService) {}

async createOrder(createOrderDto: CreateOrderDto) {
  const order = this.ordersService.createOrder(createOrderDto);

  // Emit event to notifications service
  await this.microserviceClient.notifyOrderCreated(
    order.id,
    order.userId,
    order.productName
  );

  return order;
}
```

### Example 2: Handle Event in Microservice

```typescript
// In notifications controller
@MessagePattern('order_created')
handleOrderCreated(data: { orderId: number; userId: number; productName: string }) {
  return this.notificationsService.handleOrderCreated(data);
}
```

### Example 3: Query Other Service

```typescript
// In main app
const notifications = await this.microserviceClient.getNotifications(userId);
```

## What's Happening Behind the Scenes?

### When You Create an Order:

1. ✅ HTTP request hits `/orders` endpoint
2. ✅ Order is created in OrdersService
3. ✅ MicroserviceClientService sends TCP message to notifications service
4. ✅ Notifications service receives the message on pattern `order_created`
5. ✅ NotificationsService creates notification event
6. ✅ Notification is stored and ready to be queried
7. ✅ HTTP response is returned to client

**Total time:** Milliseconds (thanks to TCP direct communication)

## Next Steps

### 1. Test All Endpoints

See [MICROSERVICES-TESTING.md](./MICROSERVICES-TESTING.md) for complete API reference

### 2. Understand the Architecture

See [MICROSERVICES.md](./MICROSERVICES.md) for detailed documentation

### 3. Customize for Your Needs

- Add more message patterns
- Integrate with real databases
- Add email/SMS notifications
- Add authentication

### 4. Deploy to Production

- Use RabbitMQ instead of TCP
- Add service discovery
- Implement health checks
- Add monitoring and logging

## Useful Commands

```bash
# Start main app in development mode
npm run start:dev

# Start main app in production mode
npm run start:prod
npm run build && node dist/main.js

# Run tests
npm test

# Run microservice
npx ts-node apps/notifications-service/main.ts

# Build for production
npm run build
```

## File Reference

| File                                                  | Purpose                                     |
| ----------------------------------------------------- | ------------------------------------------- |
| `src/orders/`                                         | Orders feature with HTTP + messaging        |
| `src/notifications/`                                  | Notifications feature with HTTP + messaging |
| `src/common/microservice-client.service.ts`           | Client for inter-service communication      |
| `src/example-microservices-integration.controller.ts` | Example implementation                      |
| `apps/notifications-service/main.ts`                  | Standalone microservice entry point         |
| `MICROSERVICES.md`                                    | Complete architecture documentation         |
| `MICROSERVICES-TESTING.md`                            | API testing guide with curl examples        |

## Troubleshooting

### Error: `Cannot connect to localhost:3001`

- Ensure notifications microservice is running
- Check if port 3001 is available

### Error: `EADDRINUSE: address already in use`

- Another process is using the port
- Use `netstat -an | grep 3001` to find the process

### Services not communicating

- Verify both services are running
- Check firewall settings
- Review console logs for errors

## Need Help?

1. Read [MICROSERVICES.md](./MICROSERVICES.md) - Full architecture guide
2. Check [MICROSERVICES-TESTING.md](./MICROSERVICES-TESTING.md) - API examples
3. Review the example controller: `src/example-microservices-integration.controller.ts`
4. Check NestJS docs: https://docs.nestjs.com/microservices/basics

## What You've Learned

✅ Created Orders microservice
✅ Created Notifications microservice  
✅ Set up inter-service communication
✅ Used TCP transport for service communication
✅ Implemented event-driven architecture
✅ Built scalable microservices system

🎉 **You now have a fully functional microservices architecture!**
