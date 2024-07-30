
// Unit tests for: validateTodo

import { NextFunction, Request, Response } from 'express';

import { validateTodo } from '../errorHandler';


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
    test('should call next() when title is valid and no dates are provided', () => {
      req.body = { title: 'Valid Title' };

      validateTodo(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should call next() when title, dueDate, and reminder are valid', () => {
      req.body = { title: 'Valid Title', dueDate: '2023-12-31', reminder: '2023-12-30' };

      validateTodo(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('should return 400 if title is missing', () => {
      req.body = { dueDate: '2023-12-31', reminder: '2023-12-30' };

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 400 if title is an empty string', () => {
      req.body = { title: '', dueDate: '2023-12-31', reminder: '2023-12-30' };

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 400 if title is not a string', () => {
      req.body = { title: 123, dueDate: '2023-12-31', reminder: '2023-12-30' };

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 400 if dueDate is invalid', () => {
      req.body = { title: 'Valid Title', dueDate: 'invalid-date', reminder: '2023-12-30' };

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid due date' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 400 if reminder is invalid', () => {
      req.body = { title: 'Valid Title', dueDate: '2023-12-31', reminder: 'invalid-date' };

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid reminder date' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 400 if both dueDate and reminder are invalid', () => {
      req.body = { title: 'Valid Title', dueDate: 'invalid-date', reminder: 'invalid-date' };

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid due date' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: validateTodo
