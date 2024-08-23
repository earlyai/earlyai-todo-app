
// Unit tests for: getProjectById

import { Project } from '../../models/project';

import { v4 as uuidv4 } from 'uuid';

import { IDatabase, IStatement, ProjectService } from '../projectService';


describe('ProjectService.getProjectById() getProjectById method', () => {
  let mockDb: IDatabase;
  let mockStatement: IStatement;
  let projectService: ProjectService;

  beforeEach(() => {
    mockStatement = {
      run: jest.fn(),
      all: jest.fn(),
      get: jest.fn()
    };

    mockDb = {
      prepare: jest.fn().mockReturnValue(mockStatement),
      exec: jest.fn()
    };

    projectService = new ProjectService(mockDb);
  });

  describe('Happy Path', () => {
    it('should return a project when a valid ID is provided', () => {
      // Arrange
      const projectId = uuidv4();
      const expectedProject: Project = {
        id: projectId,
        name: 'Test Project',
        description: 'A test project',
        dueDate: new Date()
      };

      (mockStatement.get as jest.Mock).mockReturnValue(expectedProject);

      // Act
      const result = projectService.getProjectById(projectId);

      // Assert
      expect(mockDb.prepare).toHaveBeenCalledWith('SELECT * FROM projects WHERE id = ?');
      expect(mockStatement.get).toHaveBeenCalledWith(projectId);
      expect(result).toEqual(expectedProject);
    });
  });

  describe('Edge Cases', () => {
    it('should return null when no project is found for the given ID', () => {
      // Arrange
      const projectId = uuidv4();
      (mockStatement.get as jest.Mock).mockReturnValue(undefined);

      // Act
      const result = projectService.getProjectById(projectId);

      // Assert
      expect(mockDb.prepare).toHaveBeenCalledWith('SELECT * FROM projects WHERE id = ?');
      expect(mockStatement.get).toHaveBeenCalledWith(projectId);
      expect(result).toBeNull();
    });

    it('should handle invalid ID format gracefully', () => {
      // Arrange
      const invalidId = 'invalid-id-format';
      (mockStatement.get as jest.Mock).mockReturnValue(undefined);

      // Act
      const result = projectService.getProjectById(invalidId);

      // Assert
      expect(mockDb.prepare).toHaveBeenCalledWith('SELECT * FROM projects WHERE id = ?');
      expect(mockStatement.get).toHaveBeenCalledWith(invalidId);
      expect(result).toBeNull();
    });

    it('should handle database errors gracefully', () => {
      // Arrange
      const projectId = uuidv4();
      (mockStatement.get as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      // Act & Assert
      expect(() => projectService.getProjectById(projectId)).toThrow('Database error');
      expect(mockDb.prepare).toHaveBeenCalledWith('SELECT * FROM projects WHERE id = ?');
      expect(mockStatement.get).toHaveBeenCalledWith(projectId);
    });
  });
});

// End of unit tests for: getProjectById
