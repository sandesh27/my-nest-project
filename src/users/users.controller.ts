import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { User } from './user.interface';

/**
 * UsersController
 *
 * This controller handles all HTTP requests related to users.
 *
 * In Angular terms:
 * - Angular: @Component with @Input/@Output decorators
 * - NestJS: @Controller with @Get/@Post/@Patch/@Delete decorators
 *
 * The @Controller('users') decorator means all routes in this controller
 * will be prefixed with /users.
 * So @Get() becomes GET /users, @Post() becomes POST /users, etc.
 */
@Controller('users')
export class UsersController {
  /**
   * Constructor with Dependency Injection
   *
   * This is the same DI pattern as Angular!
   * NestJS automatically injects an instance of UsersService.
   *
   * You don't need to do: new UsersService()
   * NestJS handles it for you through the DI container.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user
   *
   * HTTP Request: POST /users
   * @Body(): { name: "John Doe", email: "john@example.com" }
   *
   * Flow:
   * 1. Client sends POST request with user data
   * 2. @Body() decorator extracts the JSON body and validates it against CreateUserDto
   * 3. Call the service to create the user
   * 4. Return the created user (automatically converted to JSON)
   * @HttpCode(201) sets HTTP status to "201 Created"
   *
   * @param createUserDto - The request body (validated automatically)
   * @returns The newly created user
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // Call the service method and return its result
    // NestJS automatically converts the Promise<User> to JSON response
    return this.usersService.create(createUserDto);
  }

  /**
   * Get all users
   *
   * HTTP Request: GET /users
   *
   * Similar to Angular:
   * userService.getUsers().subscribe(users => { this.users = users; })
   *
   * @returns Array of all users
   */
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Get a single user by ID
   *
   * HTTP Request: GET /users/abc123
   *
   * The :id in the route is a path parameter.
   * @Param('id') extracts the 'id' from the URL and passes it to this method.
   *
   * @param id - The user ID from the URL
   * @returns The user object, or throws NotFoundException if not found
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    // Call service to find the user
    const user = await this.usersService.findOne(id);

    // If user not found, throw exception
    // NestJS automatically converts this to HTTP 404 response
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Update an existing user
   *
   * HTTP Request: PATCH /users/abc123
   * @Body(): { name: "Updated Name" } (only fields to update)
   *
   * Note: PATCH means partial update (you only send what changed)
   *       PUT means full replacement (you send the entire object)
   *
   * @param id - The user ID to update
   * @param updateUserDto - The fields to update
   * @returns The updated user object
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // Call service to update the user
    const user = await this.usersService.update(id, updateUserDto);

    // If user not found, throw exception
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Delete a user
   *
   * HTTP Request: DELETE /users/abc123
   *
   * @HttpCode(204) sets HTTP status to "204 No Content"
   * This is standard - DELETE requests don't return a body, just status 204.
   *
   * @param id - The user ID to delete
   * @returns Promise<void> (no response body)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    // Call service to delete the user
    const success = await this.usersService.remove(id);

    // If user not found, throw exception
    if (!success) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // No response body for DELETE (HTTP 204)
  }
}
