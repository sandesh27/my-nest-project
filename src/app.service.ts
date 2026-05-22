import { Injectable } from '@nestjs/common';

/**
 * AppService
 *
 * This is a simple service that provides a method to return a greeting message.
 * In NestJS, services are classes annotated with the @Injectable() decorator that can be injected into controllers or other services using dependency injection.
 * The getHello() method is called by the AppController to get the message that will be returned in the response to the client.
 *
 * In Angular:
 * @Injectable({
 *   providedIn: 'root',
 * })
 * export class AppService {
 *   getHello(): string {
 *     return 'Hello World!';
 *   }
 * }
 *
 * In NestJS:
 * @Injectable()
 * export class AppService {
 *   getHello(): string {
 *    return 'Hello World!';
 *  }
 * }
 *
 * This AppService is just a simple example to demonstrate the basic structure of a NestJS service and how it can be injected into a controller.
 * In a real application, you would typically have more complex services that handle business logic, interact with databases, and perform other operations.
 * For more details on services in NestJS, see:
 * https://docs.nestjs.com/providers
 */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
