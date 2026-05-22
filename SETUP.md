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

## Testing with Postman/Curl

### Create a User

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

### Get All Users

```bash
curl http://localhost:3000/users
```

### Create a Note (requires MySQL)

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"Note content here"}'
```

### Get All Notes

```bash
curl http://localhost:3000/notes
```

## MySQL Setup

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

### 4. Create Database (Manual)

If the database isn't created automatically:

```bash
mysql -u root -p
# Inside MySQL:
CREATE DATABASE nest_db;
exit
```

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
├── app.controller.ts
├── app.service.ts
├── app.module.ts             # Root module (database config)
└── main.ts                   # Entry point

test/
├── users.e2e-spec.ts         # E2E tests for Users API
├── notes.e2e-spec.ts         # E2E tests for Notes API (MySQL)
└── app.e2e-spec.ts

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
