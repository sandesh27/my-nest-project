import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * AppController Unit Tests
 *
 * These tests verify that the AppController's getHello() method returns the expected string.
 * This is a simple unit test that does not require a real database or HTTP server.
 * We use NestJS's testing utilities to create a testing module and inject the AppService.
 * The AppService is not mocked here because it is a simple service that returns a static string.
 * In a real application, you might want to mock services that have more complex logic or dependencies.
 *
 * In Angular, you would typically use TestBed to create a testing module and inject services into your components.
 * In NestJS, we use Test.createTestingModule() to create a testing module and inject services into our controllers.
 *
 * For more details on testing in NestJS, see:
 * https://docs.nestjs.com/fundamentals/testing
 */
describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
