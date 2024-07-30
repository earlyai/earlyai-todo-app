
// Unit tests for: getFormattedTodos

import { Request, Response } from 'express';


import { Todo } from '../../models/todo';

import { getFormattedTodos } from '../todoController';


// Mock classes
class MockTodo {
  public id: number = 1;
  public title: string = 'Test Todo';
  public completed: boolean = false;
  public dueDate: Date | null = null;
  public reminder: Date | null = null;
}

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
      json: jest.fn()
    } as any;
  });

  describe('Happy Path', () => {
    it('should return formatted todos when todos are available', () => {
      // Arrange
      const todos: Todo[] = [
        { ...new MockTodo(), id: 1, title: 'Todo 1', completed: true, dueDate: new Date('2023-10-10'), reminder: new Date('2023-10-05') } as any,
        { ...new MockTodo(), id: 2, title: 'Todo 2', completed: false, dueDate: null, reminder: null } as any
      ];
      mockTodoService.getAllTodos.mockReturnValue(todos);

      // Act
      getFormattedTodos(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        '1: Todo 1 [Completed] - Due: 10/10/2023 - Reminder: 10/5/2023',
        '2: Todo 2 [Pending] - Due: No due date - Reminder: No reminder'
      ]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty todos list', () => {
      // Arrange
      mockTodoService.getAllTodos.mockReturnValue([]);

      // Act
      getFormattedTodos(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should handle todos with null dueDate and reminder', () => {
      // Arrange
      const todos: Todo[] = [
        { ...new MockTodo(), id: 1, title: 'Todo 1', completed: false, dueDate: null, reminder: null } as any
      ];
      mockTodoService.getAllTodos.mockReturnValue(todos);

      // Act
      getFormattedTodos(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        '1: Todo 1 [Pending] - Due: No due date - Reminder: No reminder'
      ]);
    });

    it('should handle todos with only dueDate', () => {
      // Arrange
      const todos: Todo[] = [
        { ...new MockTodo(), id: 1, title: 'Todo 1', completed: false, dueDate: new Date('2023-10-10'), reminder: null } as any
      ];
      mockTodoService.getAllTodos.mockReturnValue(todos);

      // Act
      getFormattedTodos(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        '1: Todo 1 [Pending] - Due: 10/10/2023 - Reminder: No reminder'
      ]);
    });

    it('should handle todos with only reminder', () => {
      // Arrange
      const todos: Todo[] = [
        { ...new MockTodo(), id: 1, title: 'Todo 1', completed: false, dueDate: null, reminder: new Date('2023-10-05') } as any
      ];
      mockTodoService.getAllTodos.mockReturnValue(todos);

      // Act
      getFormattedTodos(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        '1: Todo 1 [Pending] - Due: No due date - Reminder: 10/5/2023'
      ]);
    });

    it('should handle service throwing an error', () => {
      // Arrange
      mockTodoService.getAllTodos.mockImplementation(() => {
        throw new Error('Service error');
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
