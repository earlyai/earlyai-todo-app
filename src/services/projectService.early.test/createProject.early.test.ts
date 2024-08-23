
// Unit tests for: createProject



import { IDatabase, IStatement, ProjectService } from '../projectService';



// Mock interfaces
class MockStatement implements IStatement {
  run = jest.fn();
  all = jest.fn();
  get = jest.fn();
}

class MockDatabase implements IDatabase {
  prepare = jest.fn().mockReturnValue(new MockStatement() as any);
  exec = jest.fn();
}

class MockDate {
  toISOString = jest.fn().mockReturnValue('2023-01-01T00:00:00.000Z');
}

// Mock Project model

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue('mock-uuid'),
}));

describe('ProjectService.createProject() createProject method', () => {
  let mockDb: MockDatabase;
  let projectService: ProjectService;

  beforeEach(() => {
    mockDb = new MockDatabase() as any;
    projectService = new ProjectService(mockDb as any);
  });

  describe('Happy Path', () => {
    it('should create a new project with all fields', () => {
      // Arrange
      const name = 'Test Project';
      const description = 'Test Description';
      const dueDate = new MockDate() as any;

      // Act
      const result = projectService.createProject(name, description, dueDate);

      // Assert
      expect(result).toEqual({
        id: 'mock-uuid',
        name,
        description,
        dueDate,
      });
      expect(mockDb.prepare).toHaveBeenCalledWith('INSERT INTO projects (id, name, description, dueDate) VALUES (?, ?, ?, ?)');
      expect(mockDb.prepare().run).toHaveBeenCalledWith('mock-uuid', name, description, '2023-01-01T00:00:00.000Z');
    });

    it('should create a new project without dueDate', () => {
      // Arrange
      const name = 'Test Project';
      const description = 'Test Description';

      // Act
      const result = projectService.createProject(name, description);

      // Assert
      expect(result).toEqual({
        id: 'mock-uuid',
        name,
        description,
        dueDate: undefined,
      });
      expect(mockDb.prepare).toHaveBeenCalledWith('INSERT INTO projects (id, name, description, dueDate) VALUES (?, ?, ?, ?)');
      expect(mockDb.prepare().run).toHaveBeenCalledWith('mock-uuid', name, description, undefined);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty name', () => {
      // Arrange
      const name = '';
      const description = 'Test Description';
      const dueDate = new MockDate() as any;

      // Act
      const result = projectService.createProject(name, description, dueDate);

      // Assert
      expect(result).toEqual({
        id: 'mock-uuid',
        name,
        description,
        dueDate,
      });
      expect(mockDb.prepare).toHaveBeenCalledWith('INSERT INTO projects (id, name, description, dueDate) VALUES (?, ?, ?, ?)');
      expect(mockDb.prepare().run).toHaveBeenCalledWith('mock-uuid', name, description, '2023-01-01T00:00:00.000Z');
    });

    it('should handle null description', () => {
      // Arrange
      const name = 'Test Project';
      const description = null;
      const dueDate = new MockDate() as any;

      // Act
      const result = projectService.createProject(name, description as any, dueDate);

      // Assert
      expect(result).toEqual({
        id: 'mock-uuid',
        name,
        description,
        dueDate,
      });
      expect(mockDb.prepare).toHaveBeenCalledWith('INSERT INTO projects (id, name, description, dueDate) VALUES (?, ?, ?, ?)');
      expect(mockDb.prepare().run).toHaveBeenCalledWith('mock-uuid', name, description, '2023-01-01T00:00:00.000Z');
    });

    it('should handle undefined dueDate', () => {
      // Arrange
      const name = 'Test Project';
      const description = 'Test Description';

      // Act
      const result = projectService.createProject(name, description);

      // Assert
      expect(result).toEqual({
        id: 'mock-uuid',
        name,
        description,
        dueDate: undefined,
      });
      expect(mockDb.prepare).toHaveBeenCalledWith('INSERT INTO projects (id, name, description, dueDate) VALUES (?, ?, ?, ?)');
      expect(mockDb.prepare().run).toHaveBeenCalledWith('mock-uuid', name, description, undefined);
    });
  });
});

// End of unit tests for: createProject
