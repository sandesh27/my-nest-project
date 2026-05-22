/**
 * CreateUserDto

 * Data Transfer Object for creating a new user.
 *
 * This defines the structure of the data that the client must send when making a POST request to /users.
 *
 * In Angular terms: This is like the request body interface for creating a user.
 *
 * Example:
 * POST /users
 * {  "name": "John Doe", "email": "john.doe@example.com" }
 *
 * The client must send a JSON object with "name" and "email" properties to create a new user.
 *
 * In a real application, you would also add validation decorators (e.g., @IsString(), @IsEmail()) to ensure the data is valid.
 *
 * For simplicity, this example does not include validation, but in production code, you should always validate incoming data!
 *
 * For more details on DTOs and validation, see:
 * https://docs.nestjs.com/dto-validation
 *
 */
export class CreateUserDto {
  name: string;
  email: string;
}
