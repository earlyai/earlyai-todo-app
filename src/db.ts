import Database from 'better-sqlite3';
import path from 'path';

// Initialize the database
const db = new Database(':memory:'); // Use ':memory:' for an in-memory database

// Create tables
db.exec(`
  CREATE TABLE todos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL,
    priority TEXT NOT NULL,
    dueDate TEXT,
    reminder TEXT
  );

  CREATE TABLE comments (
    id TEXT PRIMARY KEY,
    todoId TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY(todoId) REFERENCES todos(id)
  );
`);

export default db;