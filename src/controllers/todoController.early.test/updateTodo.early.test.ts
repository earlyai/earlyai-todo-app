
// Unit tests for: updateTodo

import { Request, Response } from 'express';


import { Todo } from '../../models/todo';

import { updateTodo } from '../todoController';


class MockTodoService {
  public updateTodo = jest.fn();
}

describe('updateTodo() updateTodo method', () => {
  let mockTodoService: MockTodoService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    mockTodoService = new MockTodoService();
    req = {
      params: { id: '1' },
      body: {
        title: 'Updated Title',
        completed: true,
        priority: 'high',
        dueDate: '2023-12-31T00:00:00.000Z',
        reminder: '2023-12-25T00:00:00.000Z'
      }
    } as any;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;
  });

  describe('Happy Path', () => {
    it('should update the todo and return the updated todo', () => {
      // Arrange
      const updatedTodo: Todo = {
        id: '1',
        title: 'Updated Title',
        completed: true,
        priority: 'high',
        dueDate: new Date('2023-12-31T00:00:00.000Z'),
        reminder: new Date('2023-12-25T00:00:00.000Z')
      };
      mockTodoService.updateTodo.mockReturnValue(updatedTodo as any);

      // Act
      updateTodo(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.updateTodo).toHaveBeenCalledWith('1', {
        title: 'Updated Title',
        completed: true,
        priority: 'high',
        dueDate: new Date('2023-12-31T00:00:00.000Z'),
        reminder: new Date('2023-12-25T00:00:00.000Z')
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTodo);
    });
  });

  describe('Edge Cases', () => {
    it('should return 404 if the todo is not found', () => {
      // Arrange
      mockTodoService.updateTodo.mockReturnValue(null as any);

      // Act
      updateTodo(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.updateTodo).toHaveBeenCalledWith('1', {
        title: 'Updated Title',
        completed: true,
        priority: 'high',
        dueDate: new Date('2023-12-31T00:00:00.000Z'),
        reminder: new Date('2023-12-25T00:00:00.000Z')
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Todo not found' });
    });

    it('should handle missing optional fields gracefully', () => {
      // Arrange
      req.body = {
        title: 'Updated Title',
        completed: true,
        priority: 'high'
      };
      const updatedTodo: Todo = {
        id: '1',
        title: 'Updated Title',
        completed: true,
        priority: 'high',
        dueDate: undefined,
        reminder: undefined
      };
      mockTodoService.updateTodo.mockReturnValue(updatedTodo as any);

      // Act
      updateTodo(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.updateTodo).toHaveBeenCalledWith('1', {
        title: 'Updated Title',
        completed: true,
        priority: 'high',
        dueDate: undefined,
        reminder: undefined
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTodo);
    });

    it('should return 500 if an error occurs', () => {
      // Arrange
      mockTodoService.updateTodo.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      // Act
      updateTodo(mockTodoService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});

// End of unit tests for: updateTodo
