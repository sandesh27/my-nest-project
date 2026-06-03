# Docker Setup for Microservices

This guide provides Docker configuration for running your microservices in containers.

## Files Included

1. **Dockerfile** - Build image for the application
2. **docker-compose.yml** - Orchestrate all services

## Usage

### 1. Build and Run with Docker Compose

```bash
# Build images
docker-compose build

# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Access Services

- **Main App API:** http://localhost:3000
- **Notifications Service:** tcp://localhost:3001

### 3. Test Services

```bash
# Create order
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "productName": "Docker Book",
    "quantity": 1,
    "price": 49.99
  }'

# Get notifications
curl http://localhost:3000/notifications/user/1
```

## Docker Compose Configuration

The `docker-compose.yml` file includes:

### Main Application Service

- Port 3000
- Volume mount for hot reload
- Connection to notifications service

### Notifications Microservice

- Port 3001
- Independent TCP listeners
- Can be scaled separately

## Production Considerations

1. **Use Environment Variables**
   - Store secrets in `.env` file
   - Never commit `.env` to version control

2. **Health Checks**
   - Add health check endpoints
   - Configure Docker health monitoring

3. **Logging**
   - Aggregate logs from all containers
   - Use ELK stack or similar

4. **Networking**
   - Services communicate via Docker network
   - No need to specify localhost:port

5. **Persistence**
   - Add volumes for data persistence
   - Backup databases before shutting down

## Example Scaling

```bash
# Scale notifications service to 3 instances
docker-compose up -d --scale notifications-service=3
```

## Monitoring

```bash
# View container stats
docker stats

# View logs from specific service
docker-compose logs notifications-service

# Follow logs in real-time
docker-compose logs -f main-app
```

## Building for Production

```bash
# Build optimized image
docker build -t my-nest-project:production -f Dockerfile.prod .

# Run in production
docker run -p 3000:3000 -e NODE_ENV=production my-nest-project:production
```

## Network Architecture

```
┌─────────────────────────────────────────┐
│         Docker Network                   │
├─────────────────────────────────────────┤
│                                          │
│  ┌──────────────────┐                  │
│  │   Main App       │                  │
│  │   Port 3000      │──┐                │
│  └──────────────────┘  │               │
│                         │               │
│                         ▼               │
│  ┌──────────────────┐                  │
│  │   Notifications  │                  │
│  │   Port 3001      │                  │
│  └──────────────────┘                  │
│                                          │
└─────────────────────────────────────────┘
```

## See Also

- [MICROSERVICES-QUICKSTART.md](./MICROSERVICES-QUICKSTART.md) - Quick start guide
- [MICROSERVICES.md](./MICROSERVICES.md) - Complete documentation
- [MICROSERVICES-TESTING.md](./MICROSERVICES-TESTING.md) - API testing guide
