
// Unit tests for: createTodoSignitureOnly

import { Request, Response } from 'express';



import { createTodoSignitureOnly } from '../todoController';


// Mock classes
class MockTodoService {
  public createTodo = jest.fn();
}

describe('createTodoSignitureOnly() createTodoSignitureOnly method', () => {
  let mockTodoService: MockTodoService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    mockTodoService = new MockTodoService();
    req = {
      body: {}
    } as any;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should create a new todo and return 201 status', () => {
      // Arrange
      const newTodo = { id: 1, title: 'Test Todo' };
      mockTodoService.createTodo.mockResolvedValue(newTodo as any);

      // Act
      createTodoSignitureOnly(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newTodo);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return 400 if date format is invalid', () => {
      // Arrange
      req.body = { title: 'Test Todo', dueDate: 'invalid-date' };

      // Act
      createTodoSignitureOnly(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid date format' });
    });

    it('should return 400 if title is missing', () => {
      // Arrange
      req.body = { dueDate: '2023-10-10' };

      // Act
      createTodoSignitureOnly(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Title is required' });
    });

    it('should return 500 if service throws an error', () => {
      // Arrange
      mockTodoService.createTodo.mockRejectedValue(new Error('Service error') as never);

      // Act
      createTodoSignitureOnly(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});

// End of unit tests for: createTodoSignitureOnly
