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
  ParseIntPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './create-note.dto';
import { UpdateNoteDto } from './update-note.dto';
import { Note } from './note.entity';

/**
 * NotesController
 *
 * This controller handles all HTTP requests related to notes.
 * Very similar to UsersController, but routes to /notes instead of /users.
 *
 * The main difference from UsersController is that IDs are numbers (integers)
 * instead of strings, since MySQL auto-generates numeric IDs.
 */
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  /**
   * Create a new note
   *
   * HTTP Request: POST /notes
   * @Body(): { title: "My Note", content: "Note content..." }
   *
   * @param createNoteDto - The request body
   * @returns The created note (with ID and timestamps)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesService.create(createNoteDto);
  }

  /**
   * Get all notes
   *
   * HTTP Request: GET /notes
   *
   * @returns Array of all notes, ordered by creation date (newest first)
   */
  @Get()
  findAll(): Promise<Note[]> {
    return this.notesService.findAll();
  }

  /**
   * Get a single note by ID
   *
   * HTTP Request: GET /notes/1
   *
   * @Param('id', ParseIntPipe) - Converts string ID from URL to integer
   * ParseIntPipe automatically validates that the ID is a valid integer.
   * If not, it throws a 400 Bad Request error.
   *
   * @param id - The note ID (auto-converted to number)
   * @returns The note object
   * @throws NotFoundException if note not found
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Note> {
    const note = await this.notesService.findOne(id);

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return note;
  }

  /**
   * Update an existing note
   *
   * HTTP Request: PATCH /notes/1
   * @Body(): { title: "Updated Title" }
   *
   * @param id - The note ID to update (auto-converted to number)
   * @param updateNoteDto - The fields to update
   * @returns The updated note
   * @throws NotFoundException if note not found
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    const note = await this.notesService.update(id, updateNoteDto);

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return note;
  }

  /**
   * Delete a note
   *
   * HTTP Request: DELETE /notes/1
   *
   * @param id - The note ID to delete
   * @returns 204 No Content (no response body)
   * @throws NotFoundException if note not found
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const success = await this.notesService.remove(id);

    if (!success) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
  }
}
