import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { CreateNoteDto } from './create-note.dto';
import { UpdateNoteDto } from './update-note.dto';

/**
 * NotesService
 *
 * This service contains all the business logic for note management.
 *
 * Key difference from UsersService:
 * - UsersService: Uses JSON file storage (readDb, writeDb methods)
 * - NotesService: Uses TypeORM Repository (database queries)
 *
 * TypeORM Repository provides methods like:
 * - repository.find() - SELECT all
 * - repository.findOne() - SELECT one
 * - repository.save() - INSERT/UPDATE
 * - repository.remove() - DELETE
 */
@Injectable()
export class NotesService {
  /**
   * Constructor dependency injection
   *
   * @InjectRepository(Note) tells NestJS to inject the TypeORM Repository for the Note entity.
   * This is similar to injecting HttpClient in Angular services.
   *
   * The repository provides an object-oriented interface to database operations.
   * You don't have to write SQL queries directly - TypeORM handles that!
   */
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  /**
   * create - Create a new note and save to database
   *
   * Process:
   * 1. Create a new Note entity instance
   * 2. repository.save() sends INSERT query to MySQL
   * 3. MySQL returns the created note with auto-generated ID and timestamps
   * 4. Return the saved note to the controller
   *
   * SQL Equivalent:
   * INSERT INTO notes (title, content, createdAt, updatedAt)
   * VALUES ('title', 'content', NOW(), NOW())
   *
   * @param createNoteDto - The note data from the request body
   * @returns The created note (now has ID, createdAt, updatedAt populated by MySQL)
   */
  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    // Create a new Note entity instance (but don't save yet)
    const note = this.noteRepository.create(createNoteDto);

    // Save (INSERT) to database
    // repository.save() returns the saved entity with auto-generated fields
    return await this.noteRepository.save(note);
  }

  /**
   * findAll - Get all notes from database
   *
   * SQL Equivalent:
   * SELECT * FROM notes ORDER BY createdAt DESC;
   *
   * @returns Array of all notes, ordered by creation date (newest first)
   */
  async findAll(): Promise<Note[]> {
    // repository.find() returns all records from the table
    // order: { createdAt: 'DESC' } sorts by creation date, newest first
    return await this.noteRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * findOne - Find a single note by ID
   *
   * SQL Equivalent:
   * SELECT * FROM notes WHERE id = 1;
   *
   * @param id - The note ID to search for
   * @returns The note object, or null if not found
   */
  async findOne(id: number): Promise<Note | null> {
    // repository.findOneBy() searches for a record by condition
    // Returns the found entity or null if not found
    return await this.noteRepository.findOneBy({ id });
  }

  /**
   * update - Update an existing note
   *
   * Process:
   * 1. Find the note by ID
   * 2. If found, merge new data with existing data
   * 3. Save (UPDATE) to database
   * 4. Return updated note
   *
   * SQL Equivalent:
   * UPDATE notes SET title='new title', content='new content', updatedAt=NOW() WHERE id=1;
   *
   * @param id - The note ID to update
   * @param updateNoteDto - The new data (title and/or content)
   * @returns The updated note, or null if not found
   */
  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note | null> {
    // Find the existing note
    const note = await this.findOne(id);

    // If note not found, return null
    if (!note) {
      return null;
    }

    // Merge new data with existing data
    // Object.assign updates existing properties and keeps unchanged ones
    // Example: { title: 'new' } merges into { title, content, id, createdAt, updatedAt }
    Object.assign(note, updateNoteDto);

    // Save (UPDATE) to database
    // TypeORM detects that this entity has an ID, so it updates instead of inserting
    return await this.noteRepository.save(note);
  }

  /**
   * remove - Delete a note from database
   *
   * Process:
   * 1. Find the note by ID
   * 2. If found, delete it
   * 3. Return true/false indicating success
   *
   * SQL Equivalent:
   * DELETE FROM notes WHERE id = 1;
   *
   * @param id - The note ID to delete
   * @returns true if deleted, false if note not found
   */
  async remove(id: number): Promise<boolean> {
    // Find the note first
    const note = await this.findOne(id);

    // If note not found, return false
    if (!note) {
      return false;
    }

    // Delete the note
    // repository.remove() sends a DELETE query to MySQL
    await this.noteRepository.remove(note);

    return true;
  }
}
