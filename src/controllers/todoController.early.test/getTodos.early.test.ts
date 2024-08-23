
// Unit tests for: getTodos

import { Request, Response } from 'express';


import { Todo } from '../../models/todo';

import { getTodos } from '../todoController';


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
    it('should return all todos without filters or sorting', () => {
      const todos: Todo[] = [{ id: 1, title: 'Test Todo' }] as any;
      mockTodoService.getAllTodos.mockReturnValue(todos as any);

      getTodos(mockTodoService as any)(req, res);

      expect(mockTodoService.getAllTodos).toHaveBeenCalledWith(undefined, {});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todos);
    });

    it('should filter todos by completion status', () => {
      req.query.completed = 'true';
      const todos: Todo[] = [{ id: 1, title: 'Test Todo', completed: true }] as any;
      mockTodoService.getAllTodos.mockReturnValue(todos as any);

      getTodos(mockTodoService as any)(req, res);

      expect(mockTodoService.getAllTodos).toHaveBeenCalledWith(undefined, { completed: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todos);
    });

    it('should filter todos by priority', () => {
      req.query.priority = 'high';
      const todos: Todo[] = [{ id: 1, title: 'Test Todo', priority: 'high' }] as any;
      mockTodoService.getAllTodos.mockReturnValue(todos as any);

      getTodos(mockTodoService as any)(req, res);

      expect(mockTodoService.getAllTodos).toHaveBeenCalledWith(undefined, { priority: 'high' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todos);
    });

    it('should sort todos by a valid field', () => {
      req.query.sortBy = 'title';
      const todos: Todo[] = [{ id: 1, title: 'A Todo' }, { id: 2, title: 'B Todo' }] as any;
      mockTodoService.getAllTodos.mockReturnValue(todos as any);

      getTodos(mockTodoService as any)(req, res);

      expect(mockTodoService.getAllTodos).toHaveBeenCalledWith('title', {});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todos);
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid sortBy field gracefully', () => {
      req.query.sortBy = 'invalidField';
      const todos: Todo[] = [{ id: 1, title: 'Test Todo' }] as any;
      mockTodoService.getAllTodos.mockReturnValue(todos as any);

      getTodos(mockTodoService as any)(req, res);

      expect(mockTodoService.getAllTodos).toHaveBeenCalledWith(undefined, {});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todos);
    });

    it('should handle invalid completed value gracefully', () => {
      req.query.completed = 'notABoolean';
      const todos: Todo[] = [{ id: 1, title: 'Test Todo' }] as any;
      mockTodoService.getAllTodos.mockReturnValue(todos as any);

      getTodos(mockTodoService as any)(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todos);
    });

    it('should handle service errors gracefully', () => {
      mockTodoService.getAllTodos.mockImplementation(() => {
        throw new Error('Service Error');
      });

      getTodos(mockTodoService as any)(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});

// End of unit tests for: getTodos
