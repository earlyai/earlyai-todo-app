
// Unit tests for: createTodo

import { Request, Response } from 'express';


import { Todo } from '../models/todo';

import { createTodo } from './todoController';


class MockTodoService {
  public createTodo = jest.fn();
}

describe('createTodo() createTodo method', () => {
  let mockTodoService: MockTodoService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    mockTodoService = new MockTodoService();
    req = {
      body: {}
    } as any as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any as Response;
  });

  describe('Happy Path', () => {
//    it('should create a new todo and return 201 status', () => {
//      // Arrange
//      const newTodo: Todo = {
//        id: '1',
//        title: 'Test Todo',
//        priority: 'high',
//        dueDate: new Date(),
//        reminder: new Date(),
//        completed: false
//      };
//      req.body = {
//        title: 'Test Todo',
//        priority: 'high',
//        dueDate: newTodo.dueDate.toISOString(),
//        reminder: newTodo.reminder.toISOString()
//      };
//      (mockTodoService.createTodo as unknown as jest.Mock).mockReturnValue(newTodo as any);
//
//      // Act
//      createTodo(mockTodoService as any)(req, res);
//
//      // Assert
//      expect(mockTodoService.createTodo).toHaveBeenCalledWith(
//        'Test Todo',
//        'high',
//        new Date(req.body.dueDate),
//        new Date(req.body.reminder)
//      );
//      expect(res.status).toHaveBeenCalledWith(201);
//      expect(res.json).toHaveBeenCalledWith(newTodo);
//    });
  });

  describe('Edge Cases', () => {
    it('should handle missing dueDate and reminder', () => {
      // Arrange
      const newTodo: Todo = {
        id: '1',
        title: 'Test Todo',
        priority: 'high',
        dueDate: undefined,
        reminder: undefined,
        completed: false
      };
      req.body = {
        title: 'Test Todo',
        priority: 'high'
      };
      (mockTodoService.createTodo as unknown as jest.Mock).mockReturnValue(newTodo as any);

      // Act
      createTodo(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.createTodo).toHaveBeenCalledWith(
        'Test Todo',
        'high',
        undefined,
        undefined
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newTodo);
    });

    it('should handle invalid date formats gracefully', () => {
      // Arrange
      req.body = {
        title: 'Test Todo',
        priority: 'high',
        dueDate: 'invalid-date',
        reminder: 'invalid-date'
      };

      // Act
      createTodo(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.createTodo).toHaveBeenCalledWith(
        'Test Todo',
        'high',
        undefined,
        undefined
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 500 status on service error', () => {
      // Arrange
      req.body = {
        title: 'Test Todo',
        priority: 'high',
        dueDate: new Date().toISOString(),
        reminder: new Date().toISOString()
      };
      (mockTodoService.createTodo as unknown as jest.Mock).mockImplementation(() => {
        throw new Error('Service Error');
      });

      // Act
      createTodo(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});

// End of unit tests for: createTodo
