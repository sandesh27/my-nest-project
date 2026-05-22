import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.name).toBe('John Doe');
      expect(response.body.email).toBe('john@example.com');
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();

      userId = response.body.id;
    });
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(userId);
      expect(response.body.name).toBe('John Doe');
      expect(response.body.email).toBe('john@example.com');
    });

    it('should return 404 for nonexistent user', async () => {
      await request(app.getHttpServer()).get('/users/nonexistent').expect(404);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        name: 'John Updated',
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send(updateUserDto)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.name).toBe('John Updated');
      expect(response.body.email).toBe('john@example.com');
    });

    it('should return 404 for nonexistent user', async () => {
      await request(app.getHttpServer())
        .patch('/users/nonexistent')
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      // First create another user to delete
      const createUserDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      const userIdToDelete = createResponse.body.id;

      // Then delete it
      await request(app.getHttpServer())
        .delete(`/users/${userIdToDelete}`)
        .expect(204);

      // Verify it's deleted
      await request(app.getHttpServer())
        .get(`/users/${userIdToDelete}`)
        .expect(404);
    });

    it('should return 404 for nonexistent user', async () => {
      await request(app.getHttpServer())
        .delete('/users/nonexistent')
        .expect(404);
    });
  });
});
