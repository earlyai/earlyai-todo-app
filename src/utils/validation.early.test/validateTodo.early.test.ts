
// Unit tests for: validateTodo

import { NextFunction, Request, Response } from 'express';

import { validateTodo } from '../validation';


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
    test('should call next() when title is a valid non-empty string', () => {
      req.body.title = 'Valid Title';

      validateTodo(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('should return 400 when title is missing', () => {
      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 400 when title is an empty string', () => {
      req.body.title = '';

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 400 when title is a string with only spaces', () => {
      req.body.title = '   ';

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 400 when title is not a string', () => {
      req.body.title = 123;

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 400 when title is null', () => {
      req.body.title = null;

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 400 when title is undefined', () => {
      req.body.title = undefined;

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: validateTodo
