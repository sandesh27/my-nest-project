/**
 * UpdateUserDto
 *
 * Data Transfer Object for updating user information.
 *
 * This defines the structure of the data that the client can send when making a PATCH request to /users/:id.
 *
 * In Angular terms: This is like the request body interface for updating a user.
 *
 * Example:
 * PATCH /users/abc123
 * { "name": "Updated Name", "email": "updated.email@example.com" }
 *
 * Only the provided fields will be updated, while unspecified fields remain unchanged.
 *
 * For more details on DTOs and validation, see:
 * https://docs.nestjs.com/dto-validation
 *
 */
export class UpdateUserDto {
  name?: string;
  email?: string;
}
