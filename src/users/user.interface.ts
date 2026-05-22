/**
 * User Interface
 *
 * This defines the shape of a User object in our application.
 *
 * In a real application, this would likely be a TypeORM entity or Mongoose schema, but for simplicity, we're just defining an interface.
 *
 * In Angular terms: This is like a model interface that defines the structure of user data.
 *
 * Example User object:
 * {
 *   id: "abc123",
 *   name: "John Doe",
 *   email: "
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
