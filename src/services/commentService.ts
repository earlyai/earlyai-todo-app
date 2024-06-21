import { Comment } from '../models/comment';
import { v4 as uuidv4 } from 'uuid';

export interface IDatabase {
  prepare(sql: string): IStatement;
  exec(sql: string): void;
}

export interface IStatement {
run(...params: any[]): any;
all<T = any>(): T[];
get<T = any>(...params: any[]): T | undefined;
}

export class CommentService {
  private readonly db: IDatabase;

  constructor(db: IDatabase) {
    this.db = db;
    this.initialize();
  }

  private initialize(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        todoId TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY(todoId) REFERENCES todos(id)
      );
    `);
  }
// Calling IDatabase.prepare(sql: string):IStatement
  getCommentsByTodoId(todoId: string): Comment[] {
    const stmt = this.db.prepare('SELECT * FROM comments WHERE todoId = ?');
    return stmt.all(); // Pass the parameter directly to the all method as an array
  }

  addComment(todoId: string, content: string): Comment {
    const newComment: Comment = {
      id: uuidv4(),
      todoId,
      content,
      timestamp: new Date().toISOString() // This remains as is
    };
    const stmt = this.db.prepare('INSERT INTO comments (id, todoId, content, timestamp) VALUES (?, ?, ?, ?)');
    stmt.run(newComment.id, newComment.todoId, newComment.content, newComment.timestamp);
    return newComment;
  }

  deleteComment(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM comments WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}