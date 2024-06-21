
// Unit tests for: getTodos

import { Request, Response } from 'express';


import { Todo } from '../models/todo';

import { getTodos } from './todoController';


class MockTodoService {
  public getAllTodos = jest.fn();
}

describe('getTodos() getTodos method', () => {
  let mockTodoService: MockTodoService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    mockTodoService = new MockTodoService();
    req = {
      query: {}
    } as any;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;
  });

  describe('Happy Path', () => {
    it('should return all todos with status 200', () => {
      // Arrange
      const todos: Todo[] = [
        { id: '1', title: 'Test Todo', completed: false, priority: 'low', dueDate: new Date(), reminder: new Date() }
      ];
      (mockTodoService.getAllTodos as unknown as jest.Mock).mockReturnValue(todos);

      // Act
      getTodos(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todos);
    });

    it('should filter todos by completed status', () => {
      // Arrange
      req.query.completed = 'true';
      const todos: Todo[] = [
        { id: '1', title: 'Test Todo', completed: true, priority: 'low', dueDate: new Date(), reminder: new Date() }
      ];
      (mockTodoService.getAllTodos as unknown as jest.Mock).mockReturnValue(todos);

      // Act
      getTodos(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.getAllTodos).toHaveBeenCalledWith(undefined, { completed: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todos);
    });

    it('should filter todos by priority', () => {
      // Arrange
      req.query.priority = 'high';
      const todos: Todo[] = [
        { id: '1', title: 'Test Todo', completed: false, priority: 'high', dueDate: new Date(), reminder: new Date() }
      ];
      (mockTodoService.getAllTodos as unknown as jest.Mock).mockReturnValue(todos);

      // Act
      getTodos(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.getAllTodos).toHaveBeenCalledWith(undefined, { priority: 'high' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todos);
    });

    it('should sort todos by a valid field', () => {
      // Arrange
      req.query.sortBy = 'title';
      const todos: Todo[] = [
        { id: '1', title: 'Test Todo', completed: false, priority: 'low', dueDate: new Date(), reminder: new Date() }
      ];
      (mockTodoService.getAllTodos as unknown as jest.Mock).mockReturnValue(todos);

      // Act
      getTodos(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.getAllTodos).toHaveBeenCalledWith('title', {});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todos);
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid sortBy field gracefully', () => {
      // Arrange
      req.query.sortBy = 'invalidField';
      const todos: Todo[] = [
        { id: '1', title: 'Test Todo', completed: false, priority: 'low', dueDate: new Date(), reminder: new Date() }
      ];
      (mockTodoService.getAllTodos as unknown as jest.Mock).mockReturnValue(todos);

      // Act
      getTodos(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.getAllTodos).toHaveBeenCalledWith(undefined, {});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todos);
    });

    it('should handle missing query parameters gracefully', () => {
      // Arrange
      const todos: Todo[] = [
        { id: '1', title: 'Test Todo', completed: false, priority: 'low', dueDate: new Date(), reminder: new Date() }
      ];
      (mockTodoService.getAllTodos as unknown as jest.Mock).mockReturnValue(todos);

      // Act
      getTodos(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.getAllTodos).toHaveBeenCalledWith(undefined, {});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todos);
    });

    it('should handle internal server error', () => {
      // Arrange
      (mockTodoService.getAllTodos as unknown as jest.Mock).mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      // Act
      getTodos(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});

// End of unit tests for: getTodos
