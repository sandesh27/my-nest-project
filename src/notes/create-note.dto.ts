/**
 * CreateNoteDto
 *
 * Data Transfer Object for creating a new note.
 * This defines what data the client should send when making a POST request to /notes
 *
 * In Angular terms: This is like the request body interface
 */
export class CreateNoteDto {
  /**
   * Note title (required)
   * Example: "My First Note"
   */
  title: string;

  /**
   * Note content (required)
   * Example: "This is the content of my note..."
   */
  content: string;
}
