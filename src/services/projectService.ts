import { Project } from '../models/project';
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

export class ProjectService {
  private readonly db: IDatabase;

  constructor(db: IDatabase) {
    this.db = db;
    this.initialize();
  }

  private initialize(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        dueDate TEXT
      );
    `);
  }

  createProject(name: string, description: string, dueDate?: Date): Project {
    const newProject: Project = {
      id: uuidv4(),
      name,
      description,
      dueDate
    };
    const stmt = this.db.prepare('INSERT INTO projects (id, name, description, dueDate) VALUES (?, ?, ?, ?)');
    stmt.run(newProject.id, newProject.name, newProject.description, newProject.dueDate?.toISOString());
    return newProject;
  }

  updateProject(id: string, updatedFields: Partial<Project>): Project | null {
    const existingProject = this.getProjectById(id);
    if (!existingProject) {
      return null;
    }

    const updatedProject: Project = {
      ...existingProject,
      ...updatedFields,
      dueDate: updatedFields.dueDate ? new Date(updatedFields.dueDate) : existingProject.dueDate
    };
    
    const stmt = this.db.prepare('UPDATE projects SET name = ?, description = ?, dueDate = ? WHERE id = ?');
    stmt.run(updatedProject.name, updatedProject.description, updatedProject.dueDate?.toISOString(), id);
    return updatedProject;
  }

  getProjectById(id: string): Project | null {
    const stmt = this.db.prepare('SELECT * FROM projects WHERE id = ?');
    const project = stmt.get(id);
    return project ? (project as Project) : null;
  }
}