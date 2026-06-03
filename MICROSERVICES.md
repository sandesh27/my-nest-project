# Microservices Architecture Example

This project demonstrates a **microservices architecture** built with NestJS. The application includes both a main application with embedded microservices and a standalone notifications microservice.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Main Application                         │
│                      (HTTP on port 3000)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │  Users Module  │  │  Notes Module  │  │ Orders Module  │   │
│  │   (HTTP REST)  │  │   (HTTP REST)  │  │   (HTTP REST)  │   │
│  │   + Messages   │  │   + Messages   │  │   + Messages   │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
│                                                                 │
│        ┌──────────────────────────────┐                        │
│        │ Notifications Module (HTTP)  │                        │
│        │ + Message Handlers           │                        │
│        └──────────────────────────────┘                        │
│                  │                                              │
│                  │ TCP Client                                  │
│                  │                                              │
└──────────────────┼──────────────────────────────────────────────┘
                   │
                   │ TCP Connection
                   │ (port 3001)
                   │
┌──────────────────▼──────────────────────────────────────────────┐
│            Notifications Microservice                            │
│            (Standalone, TCP port 3001)                          │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
src/
├── common/
│   └── microservice-client.service.ts    # Client for communicating with microservices
├── orders/                              # Orders feature module
│   ├── create-order.dto.ts
│   ├── order.entity.ts
│   ├── orders.controller.ts
│   ├── orders.module.ts
│   └── orders.service.ts
├── notifications/                       # Notifications feature module (also in main app)
│   ├── notification.interface.ts
│   ├── notifications.controller.ts
│   ├── notifications.module.ts
│   └── notifications.service.ts
├── users/                               # Users feature module
│   └── ...
├── notes/                               # Notes feature module
│   └── ...
├── app.controller.ts
├── app.module.ts
└── main.ts

apps/
└── notifications-service/              # Standalone microservice
    ├── main.ts                          # Microservice entry point
    └── notifications-microservice.module.ts
```

## Key Features

### 1. **Pattern-Based Messaging**

- Services communicate using `@MessagePattern()` decorators
- Messages are routed based on pattern names (e.g., 'order_created', 'get_notifications')

### 2. **Event-Driven Architecture**

- When an order is created, an event is emitted
- The notifications service listens for events and processes them asynchronously

### 3. **Request-Reply Pattern**

- Services can query data from other services using send/receive pattern
- Example: Query notifications from the notifications microservice

### 4. **TCP Transport**

- Microservices communicate over TCP protocol
- Allows services to run independently but communicate efficiently

### 5. **Hybrid Approach**

- Main application exposes both HTTP and microservice transports
- Standalone microservices run independently but can be called by the main app

## Running the Application

### 1. **Start the Main Application** (with embedded microservices)

```bash
npm run start:dev
```

This starts the main app on **http://localhost:3000**

The app exposes:

- HTTP endpoints: `/orders`, `/notifications`, `/users`, `/notes`
- Can listen to microservice messages (if configured as hybrid)

### 2. **Start the Standalone Notifications Microservice**

```bash
npx ts-node apps/notifications-service/main.ts
```

This starts the microservice on **TCP port 3001**

The notifications microservice:

- Listens for messages from other services
- Processes order events (created, completed, cancelled)
- Can be queried for notifications

## API Endpoints

### Orders API

```
POST   /orders              # Create a new order
GET    /orders              # Get all orders
GET    /orders/:id          # Get order by ID
GET    /orders/user/:userId # Get orders by user ID
```

### Notifications API

```
GET    /notifications              # Get all notifications
GET    /notifications/user/:userId  # Get user notifications
```

### Users API (Existing)

```
POST   /users              # Create a new user
GET    /users              # Get all users
GET    /users/:id          # Get user by ID
```

### Notes API (Existing)

```
POST   /notes              # Create a new note
GET    /notes              # Get all notes
GET    /notes/:id          # Get note by ID
PUT    /notes/:id          # Update a note
DELETE /notes/:id          # Delete a note
```

## Microservice Message Patterns

### From Main App → Notifications Service

**Event Patterns (emit):**

```
order_created        # { orderId, userId, productName }
order_completed      # { orderId, userId }
order_cancelled      # { orderId, userId }
```

**Request Patterns (send/receive):**

```
get_notifications    # { userId } → returns user's notifications
```

### From Orders Service (embedded)

```
update_order_status  # { orderId, status }
get_order            # { orderId }
```

## Example Usage

### 1. Create an Order (HTTP)

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "productName": "Laptop",
    "quantity": 1,
    "price": 999.99
  }'
```

### 2. Get All Orders (HTTP)

```bash
curl http://localhost:3000/orders
```

### 3. Get User Notifications (HTTP)

```bash
curl http://localhost:3000/notifications/user/1
```

## How Microservices Communicate

### Example: Order Creation Flow

1. **HTTP Request** → Create Order

   ```
   POST /orders → OrdersController.create() → OrdersService.createOrder()
   ```

2. **Emit Microservice Event**

   ```javascript
   // In your controller or service
   await this.microserviceClient.notifyOrderCreated(
     orderId,
     userId,
     productName,
   );
   ```

3. **Notifications Service Receives Event**

   ```
   TCP Port 3001: @MessagePattern('order_created')
   ```

4. **Notification Created**
   ```
   NotificationsService.handleOrderCreated() → Sends notification
   ```

## Configuration

The microservice client is configured to connect to:

- **Host:** localhost
- **Port:** 3001 (Notifications microservice)
- **Transport:** TCP

To change these settings, modify `src/common/microservice-client.service.ts`:

```typescript
this.notificationsClient = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: {
    host: 'your-host', // Change host
    port: 3001, // Change port
  },
});
```

## Real-World Use Cases

1. **Email Service**
   - Replace console logs with email sending
   - Integrate with SendGrid, Nodemailer, etc.

2. **SMS Service**
   - Add SMS notifications
   - Integrate with Twilio

3. **Analytics Service**
   - Track order events
   - Send data to analytics platform

4. **Payment Service**
   - Process payments asynchronously
   - Handle payment callbacks

5. **Inventory Service**
   - Update inventory when orders are created
   - Check stock availability

## Benefits of Microservices Architecture

✅ **Scalability** - Individual services can be scaled independently
✅ **Resilience** - Failure in one service doesn't crash entire system
✅ **Flexibility** - Different services can use different technologies
✅ **Maintainability** - Smaller, focused codebases
✅ **Deployment** - Services can be deployed independently
✅ **Asynchronous Processing** - Heavy operations don't block HTTP requests

## Next Steps

1. **Add RabbitMQ Transport** - For more robust message queuing

   ```typescript
   transport: Transport.RMQ,
   options: {
     urls: ['amqp://localhost:5672'],
     queue: 'orders_queue',
   }
   ```

2. **Add Service Discovery** - For dynamic service location
3. **Implement Circuit Breaker** - For resilience
4. **Add Logging & Tracing** - For debugging distributed systems
5. **Containerize Services** - Using Docker for deployment

## Additional Resources

- [NestJS Microservices Documentation](https://docs.nestjs.com/microservices/basics)
- [NestJS Message Patterns](https://docs.nestjs.com/microservices/basics#request-response)
- [Event-Driven Architecture](https://docs.nestjs.com/microservices/event-based)
- [RabbitMQ Guide](https://docs.nestjs.com/microservices/rabbitmq)
