import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstrap Function
 *
 * This is the entry point of the NestJS application.
 *
 * It creates an instance of the NestJS application using the AppModule, which is the root module that imports all other modules (e.g., UsersModule, NotesModule).
 *
 * After creating the application instance, it starts listening for incoming HTTP requests on the specified port (default: 3000).
 *
 * The port can be configured using the PORT environment variable, which allows you to easily change the port without modifying the code.
 *
 * For example, you can start the application on port 4000 by running:
 * PORT=4000 npm run start
 *
 * This bootstrap function is essential for starting the NestJS application and is typically found in the main.ts file.
 * For more details on bootstrapping a NestJS application, see:
 * https://docs.nestjs.com/first-steps#bootstrap-function
 *
 *
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
