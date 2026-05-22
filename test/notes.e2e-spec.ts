import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

/**
 * Notes E2E Tests
 *
 * These tests verify the complete flow: HTTP request → Controller → Service → Response
 * Tests the entire Notes API endpoints
 *
 * Note: These tests will try to connect to a real MySQL database.
 * Make sure MySQL is running and the 'nest_db' database exists or can be created.
 */
describe('Notes (e2e)', () => {
  let app: INestApplication;
  let noteId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /notes', () => {
    it('should create a new note', async () => {
      const createNoteDto = {
        title: 'First Note',
        content: 'This is the content of my first note',
      };

      const response = await request(app.getHttpServer())
        .post('/notes')
        .send(createNoteDto)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBe('First Note');
      expect(response.body.content).toBe(
        'This is the content of my first note',
      );
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();

      // Store the ID for later tests
      noteId = response.body.id;
    });

    it('should create another note for testing', async () => {
      const createNoteDto = {
        title: 'Second Note',
        content: 'Another note for testing',
      };

      await request(app.getHttpServer())
        .post('/notes')
        .send(createNoteDto)
        .expect(201);
    });
  });

  describe('GET /notes', () => {
    it('should return all notes', async () => {
      const response = await request(app.getHttpServer())
        .get('/notes')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /notes/:id', () => {
    it('should return a note by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/notes/${noteId}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(noteId);
      expect(response.body.title).toBe('First Note');
    });

    it('should return 404 for nonexistent note', async () => {
      await request(app.getHttpServer()).get('/notes/99999').expect(404);
    });

    it('should return 400 for invalid note id', async () => {
      await request(app.getHttpServer()).get('/notes/invalid').expect(400);
    });
  });

  describe('PATCH /notes/:id', () => {
    it('should update a note', async () => {
      const updateNoteDto = {
        title: 'Updated First Note',
      };

      const response = await request(app.getHttpServer())
        .patch(`/notes/${noteId}`)
        .send(updateNoteDto)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.title).toBe('Updated First Note');
      expect(response.body.content).toBe(
        'This is the content of my first note',
      ); // Should remain unchanged
    });

    it('should return 404 for nonexistent note', async () => {
      await request(app.getHttpServer())
        .patch('/notes/99999')
        .send({ title: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should delete a note', async () => {
      // First create a note to delete
      const createResponse = await request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'Note to Delete',
          content: 'This note will be deleted',
        })
        .expect(201);

      const noteIdToDelete = createResponse.body.id;

      // Then delete it
      await request(app.getHttpServer())
        .delete(`/notes/${noteIdToDelete}`)
        .expect(204);

      // Verify it's deleted
      await request(app.getHttpServer())
        .get(`/notes/${noteIdToDelete}`)
        .expect(404);
    });

    it('should return 404 for nonexistent note', async () => {
      await request(app.getHttpServer()).delete('/notes/99999').expect(404);
    });
  });
});
