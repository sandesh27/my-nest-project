# User Management API - NestJS Backend

> 🎯 **Welcome Frontend Developers!** This guide is designed for Angular developers transitioning to Node.js backend development with NestJS.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Introduction to Node.js](#introduction-to-nodejs)
3. [Introduction to NestJS](#introduction-to-nestjs)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Understanding the User Management API](#understanding-the-user-management-api)
7. [Database & Data Storage](#database--data-storage)
8. [API Endpoints](#api-endpoints)
9. [Microservices Architecture](#microservices-architecture)
10. [Orders Module & Notifications Microservice](#orders-module--notifications-microservice)
11. [Making Requests from Frontend](#making-requests-from-frontend)
12. [Proxy Forwarding & Configuration](#proxy-forwarding--configuration)
13. [Testing](#testing)
14. [Common Patterns & Comparisons](#common-patterns--comparisons)
15. [Notes Module with TypeORM & MySQL](#notes-module-with-typeorm--mysql)
16. [Next Steps](#next-steps)

---

## Project Overview

This project demonstrates multiple approaches to backend development with NestJS:

**1. Users Module (JSON File Storage)**

- Simple file-based storage for learning
- No external dependencies
- Perfect for understanding core concepts
- REST API: `/users` endpoints

**2. Notes Module (MySQL + TypeORM)**

- Industry-standard relational database
- Type-safe ORM (Object-Relational Mapping)
- Production-ready approach
- REST API: `/notes` endpoints

**3. Orders Module (In-Memory + Event-Driven)**

- Order management system
- HTTP REST API + Microservice message handlers
- Demonstrates microservices communication patterns
- REST API: `/orders` endpoints

**4. Notifications Microservice (TCP-Based)**

- Event-driven notification system
- Standalone microservice running on separate port
- Listens for order events and creates notifications
- Can be run independently or embedded
- REST API: `/notifications` endpoints

**Key Features:**

- ✅ Three data storage approaches (file-based, relational DB, in-memory)
- ✅ RESTful API endpoints for all modules
- ✅ Microservices architecture with TCP transport
- ✅ Event-driven architecture for service communication
- ✅ Comprehensive unit and E2E tests
- ✅ Type-safe with TypeScript
- ✅ Clean architecture with Controllers, Services, and DTOs
- ✅ Production-ready error handling
- ✅ Environment-based configuration
- ✅ Detailed code comments and JSDoc for learning
- ✅ Docker support for containerization

---

## Introduction to Node.js

### What is Node.js?

**Node.js is a JavaScript runtime environment** that allows you to run JavaScript outside the browser. Unlike browser JavaScript which powers frontends, Node.js powers server-side applications.

**Key Differences from Angular:**

| Aspect            | Angular (Frontend)              | Node.js (Backend)             |
| ----------------- | ------------------------------- | ----------------------------- |
| **Runtime**       | Browser (Chrome, Firefox, etc.) | Server/Computer               |
| **Purpose**       | UI interactions, rendering      | API logic, database access    |
| **Module System** | ES modules (import/export)      | CommonJS or ES modules        |
| **APIs**          | DOM, LocalStorage, fetch        | File system (fs), HTTP server |
| **Execution**     | Event-driven (user clicks)      | Server listening for requests |

### How Node.js Works

```
Client (Browser)
    ↓
HTTP Request
    ↓
Node.js Server (Listens for requests)
    ↓
Process Request (Run your logic)
    ↓
Access Database
    ↓
Send HTTP Response
    ↓
Client receives data
```

### Node.js vs Browser JavaScript

```javascript
// ❌ NOT available in Node.js (Browser only)
document.getElementById('myId');  // No DOM in server
window.location.href;             // No window object
localStorage.setItem('key', 'val'); // No localStorage

// ✅ ONLY available in Node.js (Server only)
require('fs').readFile(...);      // File system access
require('http').createServer(...); // HTTP server
process.env.DATABASE_URL;         // Environment variables
```

---

## Introduction to NestJS

### What is NestJS?

**NestJS is a framework built on top of Express.js** that helps you build scalable, maintainable server-side applications using TypeScript. Think of it as "Angular for the backend" - it uses similar architectural patterns you're familiar with.

### Why NestJS?

| Feature                  | Benefit for You                                       |
| ------------------------ | ----------------------------------------------------- |
| **Decorators**           | Just like Angular's `@Component`, `@Injectable`, etc. |
| **Dependency Injection** | Same DI pattern as Angular                            |
| **Modules**              | Organize code similar to feature modules              |
| **Services**             | Reusable business logic (like Angular services)       |
| **TypeScript**           | Type-safe - familiar language                         |

### NestJS vs Angular Architecture

```
┌─────────────────────────────────────────┐
│          Angular (Frontend)             │
├─────────────────────────────────────────┤
│  @Component                             │
│  ├─ Template (HTML)                     │
│  ├─ Styles (CSS)                        │
│  └─ Component Logic (TypeScript)        │
│                                         │
│  @Injectable Service                    │
│  └─ Business Logic                      │
└─────────────────────────────────────────┘

                  ↓ HTTP

┌─────────────────────────────────────────┐
│        NestJS (Backend)                 │
├─────────────────────────────────────────┤
│  @Controller                            │
│  ├─ Routes (@Get, @Post, etc.)          │
│  └─ Request Handling Logic              │
│                                         │
│  @Injectable Service                    │
│  ├─ Business Logic                      │
│  └─ Database Operations                 │
└─────────────────────────────────────────┘
```

---

## Project Structure

```
my-nest-project/
├── src/
│   ├── users/                    # User feature module
│   │   ├── user.interface.ts     # User data model (similar to interface in Angular)
│   │   ├── create-user.dto.ts    # Data Transfer Object for creating users
│   │   ├── update-user.dto.ts    # Data Transfer Object for updating users
│   │   ├── users.service.ts      # Business logic (like Angular service)
│   │   ├── users.controller.ts   # API endpoints (like API guard/resolver)
│   │   ├── users.module.ts       # Module definition
│   │   └── users.service.spec.ts # Unit tests
│   │
│   ├── app.controller.ts         # Root controller
│   ├── app.service.ts            # Root service
│   ├── app.module.ts             # Root module
│   └── main.ts                   # Application entry point
│
├── test/
│   ├── users.e2e-spec.ts         # End-to-end tests
│   └── app.e2e-spec.ts
│
├── data/
│   └── users.json                # Database file (created automatically)
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── README.md                     # This file
```

### Understanding Each File

#### 1. **Interface** (`user.interface.ts`)

Defines the shape of a user object - like a TypeScript interface in Angular.

```typescript
// Similar concept to Angular model interfaces
interface IUser {
  id: string;
  name: string;
  email: string;
}
```

#### 2. **DTO** (Data Transfer Object)

Objects that travel between client and server, defining what data is expected.

```typescript
// What does the client send when creating a user?
export class CreateUserDto {
  name: string;
  email: string;
}
```

#### 3. **Service** (`users.service.ts`)

Contains all business logic - creating, reading, updating, deleting users.

```typescript
// Like HttpClient in Angular, but for YOUR data operations
@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Business logic here
  }
}
```

#### 4. **Controller** (`users.controller.ts`)

Handles HTTP requests and routes them to appropriate services - like route handlers.

```typescript
@Controller('users')
export class UsersController {
  @Post() // POST /users
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
```

#### 5. **Module** (`users.module.ts`)

Bundles controllers and services together - like a feature module in Angular.

```typescript
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

---

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **Package Manager** - `pnpm`, `npm`, or `yarn` (we use pnpm)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server with file watching
pnpm run start:dev

# The server will start at http://localhost:3000
```

### Verify It's Working

```bash
# In your terminal or Postman, test:
curl http://localhost:3000

# Should return:
# "Hello World!"
```

---

## Understanding the User Management API

### How a Request Flows Through the System

```
1. Frontend (Angular) sends request
   POST /users { name: "John", email: "john@example.com" }
                        ↓
2. NestJS receives at Controller
   @Post() create(@Body() dto: CreateUserDto)
                        ↓
3. Controller calls Service
   this.usersService.create(dto)
                        ↓
4. Service processes business logic
   - Generate unique ID
   - Add timestamp
   - Save to JSON file
                        ↓
5. Service returns User object
   { id: "abc123", name: "John", email: "john@example.com", createdAt: "2026-..." }
                        ↓
6. Controller sends response back
   Status: 201 Created
   Body: User object
                        ↓
7. Frontend receives and displays data
```

### Dependency Injection Pattern

Just like Angular, NestJS uses **Dependency Injection**:

```typescript
// ✅ Good - NestJS automatically provides the service
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}

// ❌ Bad - Manual instantiation (Don't do this!)
export class UsersController {
  private usersService = new UsersService(); // ❌ Anti-pattern
}
```

---

## Database & Data Storage

### Our Approach: JSON File Storage

For **learning and small projects**, we use a simple JSON file stored in the `data/` directory.

**Why JSON files for learning?**

- ✅ No external database needed
- ✅ Easy to inspect data (just edit `data/users.json`)
- ✅ Perfect for understanding backend concepts
- ❌ Not suitable for production (scales poorly)

### How Data is Stored

**File: `data/users.json`**

```json
[
  {
    "id": "a1b2c3d4",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-05-22T10:30:00.000Z"
  },
  {
    "id": "e5f6g7h8",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "createdAt": "2026-05-22T10:35:00.000Z"
  }
]
```

### How Reading Works

```typescript
// In users.service.ts
private async readDb(): Promise<User[]> {
  // 1. Read file from disk
  const data = await fs.readFile(this.dbPath, 'utf-8');

  // 2. Parse JSON string to JavaScript object
  return JSON.parse(data);

  // Result: Array of User objects
}
```

### How Writing Works

```typescript
async create(createUserDto: CreateUserDto): Promise<User> {
  // 1. Read current users
  const users = await this.readDb();

  // 2. Create new user object
  const newUser: User = {
    id: randomBytes(4).toString('hex'),
    ...createUserDto,
    createdAt: new Date(),
  };

  // 3. Add to array
  users.push(newUser);

  // 4. Write back to file
  await this.writeDb(users);

  // 5. Return to client
  return newUser;
}
```

### The File System API

NestJS uses Node.js's **fs module** for file operations:

```typescript
import { promises as fs } from 'fs';

// Reading
const content = await fs.readFile(path, 'utf-8');

// Writing
await fs.writeFile(path, JSON.stringify(data, null, 2));

// Checking if file exists
try {
  await fs.access(path);
} catch {
  // File doesn't exist
}
```

---

## API Endpoints

### 1. Create User

```
POST /users
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com"
}

Response: 201 Created
{
  "id": "a1b2c3d4",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-05-22T10:30:00.000Z"
}
```

### 2. Get All Users

```
GET /users

Response: 200 OK
[
  {
    "id": "a1b2c3d4",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-05-22T10:30:00.000Z"
  },
  ...
]
```

### 3. Get Single User

```
GET /users/:id

Example: GET /users/a1b2c3d4

Response: 200 OK
{
  "id": "a1b2c3d4",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-05-22T10:30:00.000Z"
}
```

### 4. Update User

```
PATCH /users/:id
Content-Type: application/json

Example: PATCH /users/a1b2c3d4

Request Body:
{
  "name": "John Updated"
}

Response: 200 OK
{
  "id": "a1b2c3d4",
  "name": "John Updated",
  "email": "john@example.com",
  "createdAt": "2026-05-22T10:30:00.000Z"
}
```

### 5. Delete User

```
DELETE /users/:id

Example: DELETE /users/a1b2c3d4

Response: 204 No Content
```

---

## Making Requests from Frontend

### Using Angular's HttpClient

Since you're familiar with Angular, here's how to call these endpoints:

```typescript
// users.service.ts (in your Angular app)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  // Create user
  createUser(data: { name: string; email: string }): Observable<User> {
    return this.http.post<User>(this.apiUrl, data);
  }

  // Get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Get single user
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Update user
  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, data);
  }

  // Delete user
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

// Component usage
@Component({...})
export class UserListComponent {
  users$: Observable<User[]>;

  constructor(private userService: UserService) {
    this.users$ = this.userService.getUsers();
  }

  createNewUser() {
    this.userService.createUser({
      name: 'John Doe',
      email: 'john@example.com'
    }).subscribe(newUser => {
      console.log('User created:', newUser);
    });
  }
}
```

### Enable CORS

By default, browsers block requests from different origins. Update `main.ts` to enable CORS:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all routes
  app.enableCors({
    origin: 'http://localhost:4200', // Your Angular dev server
    credentials: true,
  });

  await app.listen(3000);
}

bootstrap();
```

---

## Proxy Forwarding & Configuration

### What is Proxy Forwarding?

In **development**, your Angular app runs on `localhost:4200` and your NestJS backend runs on `localhost:3000`. Direct requests get blocked by **CORS** (Cross-Origin Resource Sharing).

**Solution:** Use Angular's proxy to forward API requests.

### Setting Up the Proxy

#### Step 1: Create `proxy.conf.json` in Angular project root

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "pathRewrite": {
      "^/api": ""
    },
    "changeOrigin": true
  }
}
```

#### Step 2: Update `angular.json`

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "serve": {
          "options": {
            "proxyConfig": "proxy.conf.json"
          }
        }
      }
    }
  }
}
```

#### Step 3: Restart Angular dev server

```bash
ng serve
```

#### Step 4: Update API calls in Angular service

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  // ✅ Now use /api prefix - it proxies to http://localhost:3000
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
```

### Configuration for Different Environments

Create environment-specific configs:

```typescript
// environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000', // Direct URL
};

// environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com', // Production URL
};
```

Use in your service:

```typescript
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}
}
```

---

## Testing

### Run Unit Tests

```bash
# Run all unit tests
pnpm test

# Watch mode (re-run on file changes)
pnpm test:watch

# Coverage report
pnpm test:cov
```

### Run E2E Tests

```bash
# End-to-end tests (test the whole API)
pnpm run test:e2e
```

### Understanding Our Tests

Unit tests verify individual functions work correctly:

```typescript
// users.service.spec.ts
describe('UsersService', () => {
  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = { name: 'John', email: 'john@example.com' };
      const result = await service.create(createUserDto);

      expect(result.name).toBe('John');
      expect(result.id).toBeDefined();
    });
  });
});
```

E2E tests verify the full request-response cycle:

```typescript
// users.e2e-spec.ts
describe('POST /users', () => {
  it('should create a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' })
      .expect(201);

    expect(response.body.name).toBe('John');
  });
});
```

---

## Common Patterns & Comparisons

### Angular → NestJS Concepts

| Angular Concept | NestJS Equivalent        | Purpose                        |
| --------------- | ------------------------ | ------------------------------ |
| `@Component`    | `@Controller`            | Define a class with decorators |
| `@Injectable()` | `@Injectable()`          | Mark as injectable dependency  |
| Service (HTTP)  | Service (Business Logic) | Reusable logic                 |
| Module          | Module                   | Organize features              |
| Guard           | Guard                    | Protect routes                 |
| Interceptor     | Interceptor              | Transform requests/responses   |
| Pipe            | Pipe                     | Transform/validate data        |

### Async Patterns

**Angular / RxJS:**

```typescript
// Observable-based
getUsers(): Observable<User[]> {
  return this.http.get<User[]>('/users');
}

// Usage with async pipe
users$ = this.userService.getUsers();
// In template: {{ users$ | async }}
```

**NestJS / Promises & Async/Await:**

```typescript
// Promise/async-await based
async findAll(): Promise<User[]> {
  return await this.readDb();
}

// Usage
const users = await this.usersService.findAll();
```

### Error Handling

**Angular:**

```typescript
getUsers(): Observable<User[]> {
  return this.http.get<User[]>('/users').pipe(
    catchError(error => {
      console.error('Error:', error);
      return of([]);
    })
  );
}
```

**NestJS:**

```typescript
async findAll(): Promise<User[]> {
  try {
    return await this.readDb();
  } catch (error) {
    throw new BadRequestException('Failed to fetch users');
  }
}
```

### Data Validation

**Angular (Reactive Forms):**

```typescript
form = new FormGroup({
  name: new FormControl('', Validators.required),
  email: new FormControl('', Validators.email),
});
```

**NestJS (DTOs + Validation):**

```typescript
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}
```

---

## Troubleshooting

### Port Already in Use

```bash
# If port 3000 is already used, find and kill the process
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change the port in main.ts
await app.listen(3001);
```

### CORS Errors

**Problem:** "Access to XMLHttpRequest blocked by CORS policy"

**Solution:** Ensure CORS is enabled in `main.ts`:

```typescript
app.enableCors({
  origin: 'http://localhost:4200',
});
```

### File Not Found Error

**Problem:** `data/users.json` doesn't exist

**Solution:** Automatic - the service creates it on first API call. If not:

```bash
# Manually create the directory and file
mkdir data
echo "[]" > data/users.json
```

### TypeScript Errors

Always run:

```bash
# Check for TypeScript compilation errors
pnpm build
```

---

## Notes Module with TypeORM & MySQL

### Overview

The Notes module demonstrates how to use a **real relational database** (MySQL) with **TypeORM** - an Object-Relational Mapping library. This is a natural progression from the JSON file-based Users module.

**Key Concepts:**

- **Entity** - TypeORM maps entities to database tables
- **Repository** - Provides methods to interact with the database
- **TypeORM** - Bridges TypeScript objects and database records
- **MySQL** - Industry-standard relational database

### Difference: Users vs Notes

| Aspect          | Users (JSON)             | Notes (MySQL)                            |
| --------------- | ------------------------ | ---------------------------------------- |
| **Storage**     | `data/users.json` file   | MySQL database table                     |
| **ID Type**     | String (random hex)      | Integer (auto-increment)                 |
| **Data Access** | `readDb()` / `writeDb()` | TypeORM Repository                       |
| **Queries**     | Manual file I/O          | `repository.find()`, `repository.save()` |
| **Best For**    | Learning, prototypes     | Production, scalability                  |

### Setting Up MySQL

#### 1. Install MySQL

- **Windows:** Download from [mysql.com](https://dev.mysql.com/downloads/mysql/)
- **Mac:** `brew install mysql`
- **Linux:** `sudo apt-get install mysql-server`

#### 2. Start MySQL Server

**Windows:** MySQL typically starts automatically as a service

**Mac/Linux:**

```bash
brew services start mysql
# or
sudo service mysql start
```

#### 3. Verify MySQL is Running

```bash
mysql -u root -p
# If prompted for password, leave it empty (just press Enter)
# You should see: mysql>
# Type: exit
```

### Configuration

The project uses environment variables stored in `.env` file.

**File: `.env`**

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=          # Your MySQL root password (empty if no password set)
DB_NAME=nest_db
NODE_ENV=development
```

**Update DB_PASSWORD** with your MySQL root password if you set one during installation.

### Notes Entity

The Note entity defines the database table structure:

```typescript
@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('increment')
  id: number; // Auto-increment primary key

  @Column({ type: 'varchar', length: 255 })
  title: string; // Note title

  @Column({ type: 'longtext' })
  content: string; // Note content

  @CreateDateColumn()
  createdAt: Date; // Auto-set on creation

  @UpdateDateColumn()
  updatedAt: Date; // Auto-updated on modifications
}
```

**Database Table Created:**

```sql
CREATE TABLE notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### TypeORM Repository Pattern

Instead of manual file I/O, we use **Repository** - a data access pattern:

```typescript
@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async findAll(): Promise<Note[]> {
    // TypeORM converts this to: SELECT * FROM notes ORDER BY createdAt DESC
    return await this.noteRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Note | null> {
    // TypeORM converts this to: SELECT * FROM notes WHERE id = ?
    return await this.noteRepository.findOneBy({ id });
  }

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    // TypeORM converts this to: INSERT INTO notes (title, content) VALUES (?, ?)
    const note = this.noteRepository.create(createNoteDto);
    return await this.noteRepository.save(note);
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note | null> {
    // TypeORM converts this to: UPDATE notes SET ... WHERE id = ?
    const note = await this.findOne(id);
    if (!note) return null;

    Object.assign(note, updateNoteDto);
    return await this.noteRepository.save(note);
  }

  async remove(id: number): Promise<boolean> {
    // TypeORM converts this to: DELETE FROM notes WHERE id = ?
    const note = await this.findOne(id);
    if (!note) return false;

    await this.noteRepository.remove(note);
    return true;
  }
}
```

### Notes API Endpoints

#### 1. Create Note

```
POST /notes
Content-Type: application/json

Request Body:
{
  "title": "My First Note",
  "content": "This is the content of my note"
}

Response: 201 Created
{
  "id": 1,
  "title": "My First Note",
  "content": "This is the content of my note",
  "createdAt": "2026-05-22T10:30:00.000Z",
  "updatedAt": "2026-05-22T10:30:00.000Z"
}
```

#### 2. Get All Notes

```
GET /notes

Response: 200 OK
[
  {
    "id": 1,
    "title": "My First Note",
    "content": "This is the content of my note",
    "createdAt": "2026-05-22T10:30:00.000Z",
    "updatedAt": "2026-05-22T10:30:00.000Z"
  },
  ...
]
```

#### 3. Get Single Note

```
GET /notes/1

Response: 200 OK
{
  "id": 1,
  "title": "My First Note",
  "content": "This is the content of my note",
  "createdAt": "2026-05-22T10:30:00.000Z",
  "updatedAt": "2026-05-22T10:30:00.000Z"
}
```

#### 4. Update Note

```
PATCH /notes/1
Content-Type: application/json

Request Body:
{
  "title": "Updated Note Title"
}

Response: 200 OK
{
  "id": 1,
  "title": "Updated Note Title",
  "content": "This is the content of my note",
  "createdAt": "2026-05-22T10:30:00.000Z",
  "updatedAt": "2026-05-22T10:31:00.000Z"
}
```

#### 5. Delete Note

```
DELETE /notes/1

Response: 204 No Content
```

### Testing the Notes API

**Unit Tests:**

```bash
pnpm test -- notes.service.spec
```

**E2E Tests (requires MySQL connection):**

```bash
pnpm run test:e2e
```

Make sure MySQL is running and `.env` is configured before running E2E tests.

### Comparing JSON vs TypeORM

**JSON File (Users Module):**

```typescript
private async readDb(): Promise<User[]> {
  const data = await fs.readFile(this.dbPath, 'utf-8');
  return JSON.parse(data);
}
```

**TypeORM Repository (Notes Module):**

```typescript
async findAll(): Promise<Note[]> {
  return await this.noteRepository.find({ order: { createdAt: 'DESC' } });
}
```

**Benefits of TypeORM:**

- ✅ Type-safe queries
- ✅ Automatic timestamps (createdAt, updatedAt)
- ✅ Scales to millions of records
- ✅ Supports transactions
- ✅ Easy migrations
- ✅ No manual JSON parsing

### Frontend Integration

**Angular Service:**

```typescript
@Injectable({ providedIn: 'root' })
export class NoteService {
  private apiUrl = 'http://localhost:3000/notes';

  constructor(private http: HttpClient) {}

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  createNote(data: { title: string; content: string }): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, data);
  }

  updateNote(id: number, data: Partial<Note>): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/${id}`, data);
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

@Component({...})
export class NoteListComponent {
  notes$: Observable<Note[]>;

  constructor(private noteService: NoteService) {
    this.notes$ = this.noteService.getNotes();
  }
}
```

### Troubleshooting

**Error: "Access denied for user 'root'@'localhost'"**

- Update `DB_PASSWORD` in `.env` with your MySQL password
- Or create a MySQL user with no password

**Error: "ER_BAD_DB_ERROR: Unknown database 'nest_db'"**

- The database will be created automatically when `synchronize: true` is set
- Manually create it: `mysql -u root -p -e "CREATE DATABASE nest_db;"`

**E2E Tests Failing:**

- Ensure MySQL is running: `mysql -u root -p`
- Verify `.env` configuration
- Run: `pnpm run test:e2e` after starting the application

---

## Microservices Architecture

### What are Microservices?

**Microservices** is an architectural pattern where a large application is split into smaller, independent services that communicate with each other. Each service handles a specific business capability.

### Why Microservices?

| Aspect          | Traditional Monolith       | Microservices               |
| --------------- | -------------------------- | --------------------------- |
| **Scaling**     | Scale entire app           | Scale individual services   |
| **Deployment**  | Deploy everything          | Deploy single service       |
| **Technology**  | Same tech stack            | Different tech per service  |
| **Failure**     | One bug crashes everything | Failure isolated to service |
| **Development** | Single team                | Multiple independent teams  |

### Microservices in This Project

```
┌─────────────────────────────────────────┐
│     Main Application (Port 3000)        │
├─────────────────────────────────────────┤
│  • Users Module (HTTP REST)             │
│  • Notes Module (HTTP REST)             │
│  • Orders Module (HTTP REST + Events)   │
│  • Notifications Module (HTTP REST)     │
└────────────┬────────────────────────────┘
             │
             │ TCP Connection
             │ (Inter-service communication)
             │
     ┌───────▼────────┐
     │ Notifications  │
     │ Microservice   │
     │ (Port 3001)    │
     └────────────────┘
```

### Service-to-Service Communication

In this project, services communicate using **message patterns**:

```typescript
// Service A sends a message
await this.microserviceClient.emitNotificationEvent(
  'order_created',  // Pattern name
  {                 // Data payload
    orderId: 1,
    userId: 1,
    productName: 'Laptop'
  }
);

// Service B listens for message
@MessagePattern('order_created')
handleOrderCreated(data: { orderId: number; userId: number; productName: string }) {
  // Process the event
  return this.notificationsService.handleOrderCreated(data);
}
```

### Transport Mechanisms

**TCP (Transmission Control Protocol)** - What We Use

```
┌──────────────────┐
│   Main App       │
│   (Port 3000)    │
└────────┬─────────┘
         │
         │ TCP Connection
         │ localhost:3001
         │
┌────────▼─────────┐
│  Notifications   │
│  Service         │
└──────────────────┘
```

**Advantages:**

- ✅ Direct point-to-point communication
- ✅ Fast for local networks
- ✅ Simple to set up
- ✅ No extra infrastructure needed

**Limitations:**

- ❌ Not ideal for distributed systems
- ❌ Both services must be running
- ❌ No message queue/persistence

**For Production:** Consider **RabbitMQ**, **Kafka**, or **Redis**

---

## Orders Module & Notifications Microservice

### Orders Module

The Orders Module handles order creation, retrieval, and status management. It demonstrates how to build a microservice-ready module with both HTTP and event-based communication.

#### Features

- ✅ Create orders with user and product info
- ✅ Retrieve orders by ID or user
- ✅ Update order status
- ✅ Emit events when orders change
- ✅ Message handlers for inter-service communication

#### Key Files

| File                              | Purpose                           |
| --------------------------------- | --------------------------------- |
| `src/orders/orders.service.ts`    | Business logic for orders         |
| `src/orders/orders.controller.ts` | HTTP endpoints + message handlers |
| `src/orders/order.entity.ts`      | Order data model with JSDoc       |
| `src/orders/create-order.dto.ts`  | Request validation DTO            |
| `src/orders/orders.module.ts`     | Module definition                 |

#### API Endpoints

```
POST   /orders                    # Create new order
GET    /orders                    # List all orders
GET    /orders/:id                # Get order by ID
GET    /orders/user/:userId       # Get user's orders
```

#### Data Model

```typescript
/**
 * Order Entity
 * Represents an order in the system
 */
export class Order {
  /** Unique identifier for the order */
  id: number;

  /** User ID who placed the order */
  userId: number;

  /** Name/description of the product */
  productName: string;

  /** Quantity of items in the order */
  quantity: number;

  /** Price per unit */
  price: number;

  /** Timestamp when the order was created */
  createdAt: Date;

  /** Current status: pending | completed | cancelled */
  status: 'pending' | 'completed' | 'cancelled';
}
```

### Notifications Microservice

The Notifications Microservice is a **standalone service** that listens for order events and creates notifications. It demonstrates how to build an independent microservice that communicates with the main application.

#### Features

- ✅ Listens for order events from main app
- ✅ Creates notifications for users
- ✅ Can be run independently
- ✅ HTTP endpoints for accessing notifications
- ✅ Message handlers for receiving events

#### Key Files

| File                                                              | Purpose                  |
| ----------------------------------------------------------------- | ------------------------ |
| `src/notifications/notifications.service.ts`                      | Business logic           |
| `src/notifications/notifications.controller.ts`                   | HTTP + message handlers  |
| `src/notifications/notification.interface.ts`                     | NotificationEvent model  |
| `src/notifications/notifications.module.ts`                       | Module definition        |
| `apps/notifications-service/main.ts`                              | Microservice entry point |
| `apps/notifications-service/notifications-microservice.module.ts` | Root module              |

#### API Endpoints

```
GET    /notifications                  # List all notifications
GET    /notifications/user/:userId     # Get user notifications
```

#### Message Patterns Supported

| Pattern             | Purpose                  |
| ------------------- | ------------------------ |
| `order_created`     | User placed new order    |
| `order_completed`   | Order was completed      |
| `order_cancelled`   | Order was cancelled      |
| `get_notifications` | Query user notifications |

### Running the Microservices

#### Option 1: Run Everything Together

```bash
# Start main app (includes Orders + Notifications modules)
pnpm run start:dev

# Server runs on port 3000
```

#### Option 2: Run with Standalone Microservice

**Terminal 1: Main App**

```bash
pnpm run start:dev
# Runs on port 3000
```

**Terminal 2: Notifications Microservice**

```bash
npx ts-node apps/notifications-service/main.ts
# Runs on port 3001
```

### Example: Order Creation Flow

1. **User sends HTTP request**

   ```bash
   POST /example/create-order-with-notification
   {
     "userId": 1,
     "productName": "Laptop",
     "quantity": 1,
     "price": 999
   }
   ```

2. **Main App processes request**
   - OrdersController receives POST request
   - OrdersService creates order object
   - Order saved to in-memory storage

3. **Main App emits event**

   ```typescript
   await this.microserviceClient.notifyOrderCreated(
     orderId,
     userId,
     productName,
   );
   ```

4. **Notifications Microservice receives event**
   - TCP receives `order_created` message
   - `handleOrderCreated()` handler processes it
   - NotificationsService creates notification

5. **Notification stored**

   ```json
   {
     "orderId": 1,
     "userId": 1,
     "message": "Your order for Laptop has been created successfully!",
     "type": "order_created",
     "timestamp": "2026-06-04T10:30:00Z"
   }
   ```

6. **Response returned to client**
   ```json
   {
     "success": true,
     "message": "Order created and notification sent",
     "data": {
       /* order object */
     }
   }
   ```

### Testing Microservices

Use ThunderClient or Postman:

**Create order with notification:**

```
POST http://localhost:3000/example/create-order-with-notification
Content-Type: application/json

{
  "userId": 1,
  "productName": "Laptop",
  "quantity": 1,
  "price": 999
}
```

**Get user notifications:**

```
GET http://localhost:3000/notifications/user/1
```

**Watch console output:**

- Main App console: See order creation and event emission
- Microservice console: See notification creation

For detailed testing examples, see [MICROSERVICES-TESTING.md](./MICROSERVICES-TESTING.md)

---

## Next Steps

### For Frontend Developers Joining the Team

1. **Understand the request flow** - How data travels from client to server
2. **Run the tests** - See `pnpm test` and `pnpm run test:e2e` in action
3. **Create a test endpoint** - Modify `/api/hello` endpoint to return custom data
4. **Connect from Angular** - Build a simple user list component using HttpClient
5. **Debug with logs** - Add `console.log()` in NestJS services to understand execution

### Moving to Real Databases

When ready to use real databases:

```typescript
// Currently: JSON file
private async readDb(): Promise<User[]>

// Next: SQLite (simple relational)
import { Database } from 'better-sqlite3';

// Or: MongoDB
import { MongoClient } from 'mongodb';

// Or with NestJS ORM:
import { TypeOrmModule } from '@nestjs/typeorm';
```

---

## Useful Links

- **NestJS Docs:** https://docs.nestjs.com/
- **Node.js Docs:** https://nodejs.org/docs/
- **TypeScript:** https://www.typescriptlang.org/
- **Express.js (NestJS runs on Express):** https://expressjs.com/

---

## Questions?

Check the inline code comments in:

- `src/users/users.controller.ts` - Request handling
- `src/users/users.service.ts` - Business logic & database operations
- `test/users.e2e-spec.ts` - Examples of testing

Happy coding! 🚀
$ pnpm run test

# e2e tests

$ pnpm run test:e2e

# test coverage

$ pnpm run test:cov

## Stay in touch

- Author - [Sandesh Magdum]
