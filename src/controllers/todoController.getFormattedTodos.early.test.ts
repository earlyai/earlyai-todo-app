
// Unit tests for: getFormattedTodos

import { Request, Response } from 'express';


import { Todo } from '../models/todo';

import { getFormattedTodos } from './todoController';


class MockTodoService {
  public getAllTodos = jest.fn();
}

describe('getFormattedTodos() getFormattedTodos method', () => {
  let mockTodoService: MockTodoService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    mockTodoService = new MockTodoService();
    req = {} as any;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
  });

  describe('Happy Path', () => {
    it('should return formatted todos when todos are available', () => {
      // Arrange
      const todos: Todo[] = [
        { id: '1', title: 'Test Todo 1', completed: false, dueDate: new Date('2023-10-10'), reminder: new Date('2023-10-09'), priority: 'low' },
        { id: '2', title: 'Test Todo 2', completed: true, dueDate: new Date('2023-11-10'), reminder: new Date('2023-11-09'), priority: 'high' },
      ];
      (mockTodoService.getAllTodos as unknown as jest.Mock).mockReturnValue(todos);

      // Act
      getFormattedTodos(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        '1: Test Todo 1 [Pending] - Due: 10/10/2023 - Reminder: 10/9/2023',
        '2: Test Todo 2 [Completed] - Due: 11/10/2023 - Reminder: 11/9/2023',
      ]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty todos list', () => {
      // Arrange
      (mockTodoService.getAllTodos as unknown as jest.Mock).mockReturnValue([]);

      // Act
      getFormattedTodos(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should handle todos with missing dueDate and reminder', () => {
      // Arrange
      const todos: Todo[] = [
        { id: '1', title: 'Test Todo 1', completed: false, dueDate: undefined, reminder: undefined, priority: 'low' },
      ];
      (mockTodoService.getAllTodos as unknown as jest.Mock).mockReturnValue(todos);

      // Act
      getFormattedTodos(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        '1: Test Todo 1 [Pending] - Due: No due date - Reminder: No reminder',
      ]);
    });

    it('should handle internal server error', () => {
      // Arrange
      (mockTodoService.getAllTodos as unknown as jest.Mock).mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      // Act
      getFormattedTodos(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});

// End of unit tests for: getFormattedTodos
