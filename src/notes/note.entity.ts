import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Note Entity
 *
 * This entity defines the structure of the notes table in MySQL.
 * @Entity() decorator tells TypeORM to create/map a database table
 *
 * Compare to Angular:
 * - This is like a model interface, but TypeORM uses it to define database schema
 *
 * TypeORM Column Types:
 * - @PrimaryGeneratedColumn() = AUTO INCREMENT PRIMARY KEY
 * - @Column() = VARCHAR by default
 * - @CreateDateColumn() = TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * - @UpdateDateColumn() = TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 */
@Entity('notes')
export class Note {
  /**
   * Primary key with auto-increment
   * Database: id INT PRIMARY KEY AUTO_INCREMENT
   */
  @PrimaryGeneratedColumn('increment')
  id: number;

  /**
   * Note title
   * Database: title VARCHAR(255)
   */
  @Column({ type: 'varchar', length: 255 })
  title: string;

  /**
   * Note content/description
   * Database: content LONGTEXT (can store large text)
   */
  @Column({ type: 'longtext' })
  content: string;

  /**
   * Timestamp when note was created
   * Database: createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   * Auto-set by TypeORM - don't manually provide this
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Timestamp when note was last updated
   * Database: updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   * Auto-updated by TypeORM - don't manually provide this
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
