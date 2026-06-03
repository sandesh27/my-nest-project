# NestJS Project Setup Guide

## Quick Start

### Prerequisites

1. **Node.js** (v16+) - [Download](https://nodejs.org/)
2. **pnpm** - `npm install -g pnpm`
3. **MySQL** (for Notes module) - [Download Community Edition](https://dev.mysql.com/downloads/mysql/)

### Installation

```bash
# 1. Clone/navigate to the project
cd my-nest-project

# 2. Install dependencies
pnpm install

# 3. Configure MySQL (if needed)
# Update .env file with your MySQL credentials
cp .env.example .env
# Edit .env and set DB_PASSWORD if your MySQL root has a password
```

### Running the Project

```bash
# Development mode (with auto-reload)
pnpm run start:dev

# Build for production
pnpm run build

# Run production build
pnpm run start:prod

# Start server on custom port
# Edit main.ts and change: await app.listen(3000) to await app.listen(3001)
```

Server will be available at: **http://localhost:3000**

### Running Microservices

#### Option 1: Embedded Microservices (Recommended for Development)

```bash
# Start main app - includes Orders and Notifications modules
pnpm run start:dev
```

Both Orders and Notifications modules will be available:

- Orders API: `http://localhost:3000/orders`
- Notifications API: `http://localhost:3000/notifications`

#### Option 2: Standalone Microservice (Advanced)

**Terminal 1: Start main application**

```bash
pnpm run start:dev
# Runs on port 3000
```

**Terminal 2: Start notifications microservice**

```bash
npx ts-node apps/notifications-service/main.ts
# Runs on port 3001
```

When both are running, the main app will communicate with the notifications microservice via TCP.

### Docker Support

Run everything in containers:

```bash
# Build images
docker-compose build

# Start all services
docker-compose up

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:

- Main App: `http://localhost:3000`
- Notifications Microservice: `localhost:3001` (TCP)

### Testing

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode (re-run on file changes)
pnpm test:watch

# Generate coverage report
pnpm test:cov

# Run E2E tests (requires MySQL running)
pnpm run test:e2e
```

## API Endpoints

### Users Module (JSON File Storage)

- **POST** `/users` - Create user
- **GET** `/users` - Get all users
- **GET** `/users/:id` - Get specific user
- **PATCH** `/users/:id` - Update user
- **DELETE** `/users/:id` - Delete user

### Notes Module (MySQL Database)

- **POST** `/notes` - Create note
- **GET** `/notes` - Get all notes
- **GET** `/notes/:id` - Get specific note
- **PATCH** `/notes/:id` - Update note
- **DELETE** `/notes/:id` - Delete note

### Orders Module (In-Memory + Microservices)

- **POST** `/orders` - Create new order
- **GET** `/orders` - Get all orders
- **GET** `/orders/:id` - Get order by ID
- **GET** `/orders/user/:userId` - Get user's orders

### Notifications Module (Event-Driven)

- **GET** `/notifications` - Get all notifications
- **GET** `/notifications/user/:userId` - Get user notifications

### Example Integration Endpoints

These demonstrate microservices communication:

- **POST** `/example/create-order-with-notification` - Create order and send notification
- **POST** `/example/complete-order/:orderId` - Complete order and notify user
- **POST** `/example/cancel-order/:orderId` - Cancel order and notify user
- **GET** `/example/user-notifications/:userId` - Query notifications from microservice
- **POST** `/example/send-custom-event` - Send custom event
- **POST** `/example/send-custom-request` - Send custom request

## Testing with Postman/Curl

### Users Module

#### Create a User

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

#### Get All Users

```bash
curl http://localhost:3000/users
```

### Notes Module

#### Create a Note (requires MySQL)

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"Note content here"}'
```

#### Get All Notes

```bash
curl http://localhost:3000/notes
```

### Orders Module

#### Create an Order

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

#### Get All Orders

```bash
curl http://localhost:3000/orders
```

#### Get Orders by User

```bash
curl http://localhost:3000/orders/user/1
```

### Notifications Module

#### Get All Notifications

```bash
curl http://localhost:3000/notifications
```

#### Get User Notifications

```bash
curl http://localhost:3000/notifications/user/1
```

### Microservices Integration Examples

#### Create Order with Notification

```bash
curl -X POST http://localhost:3000/example/create-order-with-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "productName": "MacBook Pro",
    "quantity": 1,
    "price": 1999.99
  }'
```

Watch the console output:

- **Main App Console**: Order creation and event emission logs
- **Microservice Console**: Notification creation logs (if microservice is running)

#### Complete Order

```bash
curl -X POST http://localhost:3000/example/complete-order/1
```

#### Get User Notifications

```bash
curl http://localhost:3000/example/user-notifications/1
```

## MySQL Setup

### Database Schema

The `nest_db` database includes three main tables:

#### `notes` Table

- **Purpose:** Stores user notes
- **Columns:** id, title, content, createdAt, updatedAt
- **Status:** Using MySQL with TypeORM

#### `orders` Table

- **Purpose:** Stores customer orders
- **Columns:** id, userId, productName, quantity, price, status (pending/completed/cancelled), createdAt, updatedAt
- **Status:** In-memory storage (ready for database integration)
- **Module:** `src/orders/`

#### `notifications` Table

- **Purpose:** Stores user notifications linked to orders
- **Columns:** id, orderId, userId, message, type (order_created/order_completed/order_cancelled), isRead, createdAt, updatedAt
- **Status:** In-memory storage (ready for database integration)
- **Module:** `src/notifications/`

### 1. Start MySQL Server

**Windows:** Start from Services (MySQL80) or command line:

```bash
mysqld --console
```

**Mac:**

```bash
brew services start mysql
```

**Linux:**

```bash
sudo service mysql start
```

### 2. Verify Connection

```bash
mysql -u root -p
# If prompted for password, enter your MySQL password (or leave blank if no password)
# Type: exit
```

### 3. Configuration

Edit `.env` file:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password    # ← Update this
DB_NAME=nest_db
NODE_ENV=development
```

### 4. Create Database and Tables

**Option A: Using MySQL CLI**

```bash
# Import the database schema
mysql -u root -p nest_db < db/Dump20260522.sql
```

**Option B: Manual (if database exists)**

```bash
mysql -u root -p
# Inside MySQL:
CREATE DATABASE nest_db;
USE nest_db;
# Then copy and paste the table creation statements from db/Dump20260522.sql
exit
```

**Option C: Auto-import on app startup**

The database will be automatically created when you run the app (if configured). Ensure `.env` has correct MySQL credentials.

## Project Structure

```
src/
├── users/                    # User feature (JSON file storage)
│   ├── user.interface.ts
│   ├── create-user.dto.ts
│   ├── update-user.dto.ts
│   ├── users.service.ts      # Business logic
│   ├── users.controller.ts   # API routes
│   ├── users.module.ts       # Feature module
│   └── users.service.spec.ts # Unit tests
│
├── notes/                    # Notes feature (MySQL database)
│   ├── note.entity.ts        # TypeORM entity
│   ├── create-note.dto.ts
│   ├── update-note.dto.ts
│   ├── notes.service.ts      # Business logic
│   ├── notes.controller.ts   # API routes
│   ├── notes.module.ts       # Feature module
│   └── notes.service.spec.ts # Unit tests
│
├── orders/                   # Orders module (Microservice, in-memory)
│   ├── order.entity.ts       # Order data model
│   ├── create-order.dto.ts   # Order creation DTO
│   ├── orders.service.ts     # Business logic + message handlers
│   ├── orders.controller.ts  # HTTP endpoints + message patterns
│   └── orders.module.ts      # Feature module
│
├── notifications/            # Notifications module (Microservice, event-driven)
│   ├── notification.interface.ts  # Notification data model
│   ├── notifications.service.ts   # Business logic
│   ├── notifications.controller.ts # HTTP endpoints + event listeners
│   └── notifications.module.ts    # Feature module
│
├── common/                   # Shared services
│   └── microservice-client.service.ts  # TCP client for inter-service communication
│
├── app.controller.ts
├── app.service.ts
├── app.module.ts             # Root module (all imports + config)
└── main.ts                   # Entry point

apps/
└── notifications-service/    # Standalone notifications microservice
    ├── main.ts               # Bootstrap entry point (runs on port 3001)
    └── notifications-microservice.module.ts

test/
├── users.e2e-spec.ts         # E2E tests for Users API
├── notes.e2e-spec.ts         # E2E tests for Notes API (MySQL)
├── app.e2e-spec.ts
└── ...

db/
└── Dump20260522.sql          # MySQL database schema (notes, orders, notifications tables)

data/
└── users.json                # User data (auto-created)

.env                          # Configuration (gitignored)
.env.example                  # Configuration template
```

## Common Issues

### Port 3000 Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### MySQL Connection Error

**Error:** `Access denied for user 'root'@'localhost' (using password: NO)`

**Solution:** Update `.env` file with your MySQL password

```
DB_PASSWORD=your_password
```

### Database Not Found

**Error:** `ER_BAD_DB_ERROR: Unknown database 'nest_db'`

**Solution:** Database will be created automatically. If not:

```bash
mysql -u root -p -e "CREATE DATABASE nest_db;"
```

### E2E Tests Failing

1. Ensure MySQL is running: `mysql -u root -p`
2. Check `.env` configuration
3. Run: `pnpm run test:e2e`

## Next Steps

1. **Understand the code** - Read the comments in service and controller files
2. **Run the tests** - See real examples of the API in action
3. **Build API client** - Create Angular service to call `/users` or `/notes` endpoints
4. **Extend functionality** - Add new fields to entities/DTOs
5. **Explore TypeORM** - Check [TypeORM documentation](https://typeorm.io/)

## Links

- **NestJS Docs:** https://docs.nestjs.com/
- **TypeORM Docs:** https://typeorm.io/
- **MySQL Docs:** https://dev.mysql.com/doc/
- **Node.js Docs:** https://nodejs.org/docs/
- **TypeScript:** https://www.typescriptlang.org/

## Questions?

Check the inline comments in:

- `src/notes/note.entity.ts` - TypeORM entity definition
- `src/notes/notes.service.ts` - Database operations with TypeORM
- `src/notes/notes.controller.ts` - HTTP request handling
- `README.md` - Comprehensive documentation

Happy coding! 🚀
