import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Note } from './note.entity';

/**
 * NotesModule
 *
 * This module bundles the Note entity, NotesController, and NotesService.
 *
 * TypeOrmModule.forFeature([Note]) tells NestJS to:
 * 1. Create a database table for the Note entity (if it doesn't exist)
 * 2. Create a Repository for the Note entity
 * 3. Make the repository available for injection in the service
 */
@Module({
  // Import TypeORM for the Note entity
  // This creates the repository and registers it with DI
  imports: [TypeOrmModule.forFeature([Note])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
