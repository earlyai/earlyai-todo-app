import { Todo } from '../models/todo';
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

type SortableFields = 'title' | 'priority' | 'dueDate' | 'reminder' | 'completed';

export class TodoService {
  private readonly db: IDatabase;

  constructor(db: IDatabase) {
    this.db = db;
    this.initialize();
  }

  private initialize(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        completed BOOLEAN NOT NULL,
        priority TEXT NOT NULL,
        dueDate TEXT,
        reminder TEXT
      );
    `);
  }

  getAllTodos(sortBy?: SortableFields, filterBy?: { completed?: boolean; priority?: string }): Todo[] {
    const stmt = this.db.prepare('SELECT * FROM todos');
    let todos = stmt.all<Todo>();

    if (filterBy) {
      todos = this._filterTodos(todos, filterBy);
    }

    if (sortBy) {
      todos = this._sortTodos(todos, sortBy);
    }

    return todos;
  }

  createTodo(title: string, priority: 'low' | 'medium' | 'high' = 'low', dueDate?: Date, reminder?: Date): Todo {
    const newTodo: Todo = {
      id: uuidv4(),
      title,
      completed: false,
      priority,
      dueDate,
      reminder
    };
    const stmt = this.db.prepare('INSERT INTO todos (id, title, completed, priority, dueDate, reminder) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(newTodo.id, newTodo.title, newTodo.completed, newTodo.priority, newTodo.dueDate?.toISOString(), newTodo.reminder?.toISOString());
    return newTodo;
  }

  //this method calling the updateTodo(title: string, priority: 'low' | 'medium' | 'high' = 'low', dueDate?: Date, reminder?: Date)
  updateTodo(id: string, updatedFields: Partial<Todo>): Todo | null {
    const existingTodo = this.getTodoById(id);
    if (!existingTodo) {
      return null;
    }
    const updatedTodo = { ...existingTodo, ...updatedFields };
    const stmt = this.db.prepare('UPDATE todos SET title = ?, completed = ?, priority = ?, dueDate = ?, reminder = ? WHERE id = ?');
    stmt.run(updatedTodo.title, updatedTodo.completed, updatedTodo.priority, updatedTodo.dueDate?.toISOString(), updatedTodo.reminder?.toISOString(), id);
    return updatedTodo;
  }

  deleteTodo(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM todos WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  getTodoById(id: string): Todo | null {
    const stmt = this.db.prepare('SELECT * FROM todos WHERE id = ?');
    const todo = stmt.get<Todo>(id);
    return todo || null;
  }

  private _sortTodos(todos: Todo[], sortBy: SortableFields): Todo[] {
    return todos.sort((a, b) => {
      const aValue = a[sortBy] ?? '';
      const bValue = b[sortBy] ?? '';
      if (aValue < bValue) {
        return -1;
      }
      if (aValue > bValue) {
        return 1;
      }
      return 0;
    });
  }

  private _filterTodos(todos: Todo[], filterBy: { completed?: boolean; priority?: string }): Todo[] {
    return todos.filter(todo => {
      let matches = true;
      if (filterBy.completed !== undefined) {
        matches = matches && todo.completed === filterBy.completed;
      }
      if (filterBy.priority) {
        matches = matches && todo.priority === filterBy.priority;
      }
      return matches;
    });
  }
}