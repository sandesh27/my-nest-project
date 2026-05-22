/**
 * UpdateNoteDto
 *
 * Data Transfer Object for updating a note.
 * All fields are optional (partial update).
 * This allows clients to update only the fields they need to change.
 *
 * Example: PATCH /notes/1 { title: "Updated Title" }
 * Only title will be updated, content remains unchanged.
 */
export class UpdateNoteDto {
  /**
   * Updated note title (optional)
   */
  title?: string;

  /**
   * Updated note content (optional)
   */
  content?: string;
}
