
// Unit tests for: updateProject

import { Project } from '../../models/project';


import { IDatabase, IStatement, ProjectService } from '../projectService';


jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe('ProjectService.updateProject() updateProject method', () => {
  let dbMock: jest.Mocked<IDatabase>;
  let statementMock: jest.Mocked<IStatement>;
  let projectService: ProjectService;

  beforeEach(() => {
    statementMock = {
      run: jest.fn(),
      all: jest.fn(),
      get: jest.fn(),
    };

    dbMock = {
      prepare: jest.fn().mockReturnValue(statementMock),
      exec: jest.fn(),
    };

    projectService = new ProjectService(dbMock);
  });

  describe('Happy Path', () => {
    it('should update the project successfully when all fields are provided', () => {
      // Arrange
      const existingProject: Project = {
        id: 'existing-id',
        name: 'Existing Project',
        description: 'Existing Description',
        dueDate: new Date('2023-12-31'),
      };

      const updatedFields: Partial<Project> = {
        name: 'Updated Project',
        description: 'Updated Description',
        dueDate: new Date('2024-01-01'),
      };

      const expectedUpdatedProject: Project = {
        ...existingProject,
        ...updatedFields,
      };

      statementMock.get.mockReturnValue(existingProject);

      // Act
      const result = projectService.updateProject(existingProject.id, updatedFields);

      // Assert
      expect(result).toEqual(expectedUpdatedProject);
      expect(statementMock.run).toHaveBeenCalledWith(
        updatedFields.name,
        updatedFields.description,
        updatedFields.dueDate?.toISOString(),
        existingProject.id
      );
    });

    it('should update the project successfully when only some fields are provided', () => {
      // Arrange
      const existingProject: Project = {
        id: 'existing-id',
        name: 'Existing Project',
        description: 'Existing Description',
        dueDate: new Date('2023-12-31'),
      };

      const updatedFields: Partial<Project> = {
        name: 'Updated Project',
      };

      const expectedUpdatedProject: Project = {
        ...existingProject,
        ...updatedFields,
      };

      statementMock.get.mockReturnValue(existingProject);

      // Act
      const result = projectService.updateProject(existingProject.id, updatedFields);

      // Assert
      expect(result).toEqual(expectedUpdatedProject);
      expect(statementMock.run).toHaveBeenCalledWith(
        updatedFields.name,
        existingProject.description,
        existingProject.dueDate?.toISOString(),
        existingProject.id
      );
    });
  });

  describe('Edge Cases', () => {
    it('should return null if the project does not exist', () => {
      // Arrange
      const nonExistentProjectId = 'non-existent-id';
      statementMock.get.mockReturnValue(undefined);

      // Act
      const result = projectService.updateProject(nonExistentProjectId, { name: 'New Name' });

      // Assert
      expect(result).toBeNull();
      expect(statementMock.run).not.toHaveBeenCalled();
    });

    it('should handle updating with an empty updatedFields object', () => {
      // Arrange
      const existingProject: Project = {
        id: 'existing-id',
        name: 'Existing Project',
        description: 'Existing Description',
        dueDate: new Date('2023-12-31'),
      };

      const updatedFields: Partial<Project> = {};

      statementMock.get.mockReturnValue(existingProject);

      // Act
      const result = projectService.updateProject(existingProject.id, updatedFields);

      // Assert
      expect(result).toEqual(existingProject);
      expect(statementMock.run).toHaveBeenCalledWith(
        existingProject.name,
        existingProject.description,
        existingProject.dueDate?.toISOString(),
        existingProject.id
      );
    });

//    it('should handle updating with a null dueDate', () => {
//      // Arrange
//      const existingProject: Project = {
//        id: 'existing-id',
//        name: 'Existing Project',
//        description: 'Existing Description',
//        dueDate: new Date('2023-12-31'),
//      };
//
//      const updatedFields: Partial<Project> = {
//        dueDate: null,
//      };
//
//      const expectedUpdatedProject: Project = {
//        ...existingProject,
//        dueDate: null,
//      };
//
//      statementMock.get.mockReturnValue(existingProject);
//
//      // Act
//      const result = projectService.updateProject(existingProject.id, updatedFields);
//
//      // Assert
//      expect(result).toEqual(expectedUpdatedProject);
//      expect(statementMock.run).toHaveBeenCalledWith(
//        existingProject.name,
//        existingProject.description,
//        null,
//        existingProject.id
//      );
//    });
  });
});

// End of unit tests for: updateProject
