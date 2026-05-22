import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * AppController
 *
 * This is the main controller for the application. It handles HTTP requests to the root endpoint '/'.
 * It uses the AppService to get a greeting message and returns it in the response.
 *
 * In Angular terms:
 * - Angular: @Component with @Input/@Output decorators
 * - NestJS: @Controller with @Get/@Post/@Patch/@Delete decorators
 * The @Controller() decorator means this controller will handle routes without any prefix (i.e., root routes).
 * So @Get() becomes GET /, @Post() becomes POST /, etc.
 * The constructor uses Dependency Injection to inject an instance of AppService, which is a common pattern in NestJS (similar to Angular).
 *
 * For more details on controllers in NestJS, see:
 * https://docs.nestjs.com/controllers
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
