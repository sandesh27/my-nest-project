import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotesService } from './notes.service';
import { Note } from './note.entity';
import { Repository } from 'typeorm';

/**
 * NotesService Tests
 *
 * These tests verify that the NotesService methods work correctly.
 * We mock the TypeORM Repository so we don't need a real database.
 */
describe('NotesService', () => {
  let service: NotesService;
  let repository: Repository<Note>;

  beforeEach(async () => {
    // Create a mock repository with jest.fn()
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    repository = module.get<Repository<Note>>(getRepositoryToken(Note));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new note', async () => {
      const createNoteDto = {
        title: 'Test Note',
        content: 'This is a test note',
      };

      const mockNote: Note = {
        id: 1,
        ...createNoteDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the repository methods
      (repository.create as jest.Mock).mockReturnValue(mockNote);
      (repository.save as jest.Mock).mockResolvedValue(mockNote);

      const result = await service.create(createNoteDto);

      expect(result).toEqual(mockNote);
      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Note');
      expect(repository.create).toHaveBeenCalledWith(createNoteDto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all notes', async () => {
      const mockNotes: Note[] = [
        {
          id: 1,
          title: 'Note 1',
          content: 'Content 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Note 2',
          content: 'Content 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (repository.find as jest.Mock).mockResolvedValue(mockNotes);

      const result = await service.findAll();

      expect(result).toEqual(mockNotes);
      expect(result.length).toBe(2);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return empty array when no notes exist', async () => {
      (repository.find as jest.Mock).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a note by id', async () => {
      const mockNote: Note = {
        id: 1,
        title: 'Test Note',
        content: 'Test content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (repository.findOneBy as jest.Mock).mockResolvedValue(mockNote);

      const result = await service.findOne(1);

      expect(result).toEqual(mockNote);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if note not found', async () => {
      (repository.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const existingNote: Note = {
        id: 1,
        title: 'Original Title',
        content: 'Original Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedNote: Note = {
        ...existingNote,
        title: 'Updated Title',
      };

      (repository.findOneBy as jest.Mock).mockResolvedValue(existingNote);
      (repository.save as jest.Mock).mockResolvedValue(updatedNote);

      const result = await service.update(1, { title: 'Updated Title' });

      expect(result).toEqual(updatedNote);
      expect(result?.title).toBe('Updated Title');
      expect(repository.save).toHaveBeenCalled();
    });

    it('should return null if note not found', async () => {
      (repository.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await service.update(999, { title: 'New Title' });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a note', async () => {
      const mockNote: Note = {
        id: 1,
        title: 'To Delete',
        content: 'Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (repository.findOneBy as jest.Mock).mockResolvedValue(mockNote);
      (repository.remove as jest.Mock).mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(result).toBe(true);
      expect(repository.remove).toHaveBeenCalledWith(mockNote);
    });

    it('should return false if note not found', async () => {
      (repository.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await service.remove(999);

      expect(result).toBe(false);
    });
  });
});
