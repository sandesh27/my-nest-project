import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { User } from './user.interface';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

/**
 * UsersService
 *
 * This service contains all the business logic for user management.
 * Think of it like an Angular service, but instead of making HTTP calls,
 * it directly manages user data stored in a JSON file.
 *
 * Similar to Angular services:
 * - Angular: HttpClient.get('/api/users') → HTTP request to backend
 * - NestJS: usersService.findAll() → Direct data access
 */
@Injectable()
export class UsersService {
  // This is the path where our JSON "database" is stored
  // process.cwd() = current working directory (project root)
  // So this resolves to: /project-root/data/users.json
  private readonly dbPath = join(process.cwd(), 'data', 'users.json');

  /**
   * onModuleInit - Called automatically by NestJS when the module starts
   * Think of it like ngOnInit but for the entire service
   */
  async onModuleInit() {
    await this.ensureDbFile();
  }

  /**
   * ensureDbFile
   *
   * This method ensures the JSON database file exists.
   * If it doesn't exist, it creates the 'data' directory and an empty users.json file.
   *
   * This is the initialization step - similar to setting up local storage in Angular.
   */
  private async ensureDbFile() {
    try {
      // Try to access the file (check if it exists)
      await fs.access(this.dbPath);
    } catch {
      // File doesn't exist, so create it
      const dir = join(process.cwd(), 'data');
      try {
        // Check if the 'data' directory exists
        await fs.access(dir);
      } catch {
        // Directory doesn't exist, create it
        // { recursive: true } means create parent directories if needed
        await fs.mkdir(dir, { recursive: true });
      }
      // Create an empty JSON array file (empty user list)
      await fs.writeFile(this.dbPath, JSON.stringify([], null, 2));
    }
  }

  /**
   * readDb - Read all users from the JSON file
   *
   * This is like fetching from a database, but from a JSON file instead.
   *
   * Steps:
   * 1. Read the file as string from disk
   * 2. Parse the JSON string to JavaScript objects
   * 3. Return array of users
   *
   * In a real database, this would be: SELECT * FROM users;
   */
  private async readDb(): Promise<User[]> {
    try {
      // Read file content as UTF-8 string
      const data = await fs.readFile(this.dbPath, 'utf-8');
      // Parse JSON string to JavaScript array of objects
      // Example: '[{"id":"1","name":"John"}]' → [{ id: '1', name: 'John' }]
      return JSON.parse(data);
    } catch {
      // If file reading fails, return empty array
      return [];
    }
  }

  /**
   * writeDb - Write all users back to the JSON file
   *
   * This persists (saves) data to disk.
   *
   * In a real database, this would be: UPDATE users SET ...;
   *
   * @param users - Array of user objects to save
   */
  private async writeDb(users: User[]): Promise<void> {
    // JSON.stringify converts JavaScript objects to JSON string
    // null, 2 = pretty-print with 2-space indentation
    // This makes the JSON file human-readable
    await fs.writeFile(this.dbPath, JSON.stringify(users, null, 2));
  }

  /**
   * create - Create a new user
   *
   * This is called when: POST /users { name: "John", email: "john@example.com" }
   *
   * Steps:
   * 1. Read existing users from file
   * 2. Create new user object with unique ID and timestamp
   * 3. Add to array
   * 4. Save array back to file
   * 5. Return the new user to the controller
   *
   * @param createUserDto - Data sent from the client { name, email }
   * @returns The newly created user with ID and timestamp
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Step 1: Read all current users from JSON file
    const users = await this.readDb();

    // Step 2: Create new user object
    const newUser: User = {
      // Generate a unique ID (8 characters, hex format)
      // randomBytes(4) creates 4 random bytes, .toString('hex') converts to hex string
      id: randomBytes(4).toString('hex'),
      // Spread the DTO values (name, email) into the new user
      ...createUserDto,
      // Add current timestamp when user was created
      createdAt: new Date(),
    };

    // Step 3: Add to array
    users.push(newUser);

    // Step 4: Save to file
    await this.writeDb(users);

    // Step 5: Return to controller, which sends to client
    return newUser;
  }

  /**
   * findAll - Get all users
   *
   * This is called when: GET /users
   *
   * In SQL: SELECT * FROM users;
   *
   * @returns Array of all users
   */
  async findAll(): Promise<User[]> {
    return this.readDb();
  }

  /**
   * findOne - Find a single user by ID
   *
   * This is called when: GET /users/abc123
   *
   * In SQL: SELECT * FROM users WHERE id = 'abc123';
   *
   * @param id - The user ID to search for
   * @returns The user object, or null if not found
   */
  async findOne(id: string): Promise<User | null> {
    const users = await this.readDb();
    // Array.find() returns first matching element or undefined
    // The || null converts undefined to null explicitly
    return users.find((user) => user.id === id) || null;
  }

  /**
   * update - Update an existing user
   *
   * This is called when: PATCH /users/abc123 { name: "John Updated" }
   *
   * In SQL: UPDATE users SET name='John Updated' WHERE id='abc123';
   *
   * @param id - The user ID to update
   * @param updateUserDto - Partial data to update (name and/or email)
   * @returns Updated user object, or null if user doesn't exist
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const users = await this.readDb();

    // Find the index of the user in the array
    const index = users.findIndex((user) => user.id === id);

    // If user not found, return null
    if (index === -1) {
      return null;
    }

    // Spread operator merges existing user with new data
    // Example: { id: '1', name: 'John', email: 'john@example.com' }
    //          + { name: 'Jane' }
    //          = { id: '1', name: 'Jane', email: 'john@example.com' }
    users[index] = { ...users[index], ...updateUserDto };

    // Save changes to file
    await this.writeDb(users);

    // Return the updated user
    return users[index];
  }

  /**
   * remove - Delete a user
   *
   * This is called when: DELETE /users/abc123
   *
   * In SQL: DELETE FROM users WHERE id='abc123';
   *
   * @param id - The user ID to delete
   * @returns true if deleted, false if user not found
   */
  async remove(id: string): Promise<boolean> {
    const users = await this.readDb();

    // Find the index of the user to delete
    const index = users.findIndex((user) => user.id === id);

    // If user not found, return false
    if (index === -1) {
      return false;
    }

    // Remove user from array
    // splice(index, 1) removes 1 element at the given index
    users.splice(index, 1);

    // Save changes to file
    await this.writeDb(users);

    // Return true to indicate success
    return true;
  }
}
