import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * AppController E2E Tests
 *
 * These tests verify the complete flow: HTTP request → Controller → Service → Response
 * Tests the root endpoint '/' to ensure the application is running and responding correctly.
 *
 * Note: These tests will try to connect to a real MySQL database if the AppModule is configured to do so.
 * Make sure MySQL is running and the 'nest_db' database exists or can be created.
 * For more comprehensive E2E tests, you would typically test all your API endpoints (e.g., /users, /notes) in separate test files (e.g., users.e2e-spec.ts, notes.e2e-spec.ts).
 */
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterEach(async () => {
    await app.close();
  });
});
