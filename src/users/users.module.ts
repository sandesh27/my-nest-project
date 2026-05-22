import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
/**
 * UsersModule
 *
 * This module bundles the UsersController and UsersService together.
 *
 * In NestJS, a module is a class annotated with @Module() decorator that organizes related components (controllers, providers, etc.) into a cohesive block.
 *
 * This module contains the controllers and providers related to user management.
 *
 * In Angular:
 * @NgModule({
 *    declarations: [UserListComponent, UserDetailComponent],
 *     providers: [UserService],
 * })
 *
 * In NestJS:
 * @Module({
 *   controllers: [UsersController],
 *   providers: [UsersService],
 * })
 *
 */
export class UsersModule {}
