
// Unit tests for: validateTodo

import { NextFunction, Request, Response } from 'express';

import { validateTodo } from './validation';


describe('validateTodo() validateTodo method', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('Happy Path', () => {
    it('should call next() when title is a valid non-empty string', () => {
      // Arrange
      req.body.title = 'Valid Title';

      // Act
      validateTodo(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should return 400 when title is missing', () => {
      // Arrange
      req.body.title = undefined;

      // Act
      validateTodo(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect((res.status as unknown as jest.Mock).mock.calls.length).toBe(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect((res.json as unknown as jest.Mock).mock.calls.length).toBe(1);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when title is an empty string', () => {
      // Arrange
      req.body.title = '';

      // Act
      validateTodo(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect((res.status as unknown as jest.Mock).mock.calls.length).toBe(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect((res.json as unknown as jest.Mock).mock.calls.length).toBe(1);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when title is a string with only spaces', () => {
      // Arrange
      req.body.title = '   ';

      // Act
      validateTodo(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect((res.status as unknown as jest.Mock).mock.calls.length).toBe(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect((res.json as unknown as jest.Mock).mock.calls.length).toBe(1);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when title is not a string', () => {
      // Arrange
      req.body.title = 123;

      // Act
      validateTodo(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect((res.status as unknown as jest.Mock).mock.calls.length).toBe(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect((res.json as unknown as jest.Mock).mock.calls.length).toBe(1);
      expect(next).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: validateTodo
