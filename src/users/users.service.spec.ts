import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { promises as fs } from 'fs';

jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
    mkdir: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[]');
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const createUserDto = { name: 'John Doe', email: 'john@example.com' };
      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(fs.writeFile).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: '1',
          name: 'John',
          email: 'john@example.com',
          createdAt: '2026-05-22T08:41:54.098Z',
        },
        {
          id: '2',
          name: 'Jane',
          email: 'jane@example.com',
          createdAt: '2026-05-22T08:41:54.098Z',
        },
      ];

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(users));

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(fs.readFile).toHaveBeenCalled();
    });

    it('should return empty array when no users exist', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        createdAt: '2026-05-22T08:41:54.098Z',
      };
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify([user]));

      const result = await service.findOne('1');

      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[]');

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const existingUser = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        createdAt: '2026-05-22T08:41:54.098Z',
      };
      (fs.readFile as jest.Mock).mockResolvedValue(
        JSON.stringify([existingUser]),
      );
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const updateUserDto = { name: 'John Updated' };
      const result = await service.update('1', updateUserDto);

      expect(result).toBeDefined();
      expect(result?.name).toBe('John Updated');
      expect(result?.email).toBe('john@example.com');
    });

    it('should return null if user not found', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[]');

      const result = await service.update('nonexistent', { name: 'Updated' });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const user = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        createdAt: '2026-05-22T08:41:54.098Z',
      };
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify([user]));
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await service.remove('1');

      expect(result).toBe(true);
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should return false if user not found', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[]');

      const result = await service.remove('nonexistent');

      expect(result).toBe(false);
    });
  });
});
