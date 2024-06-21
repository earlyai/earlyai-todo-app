
// Unit tests for: validateTodo

import { NextFunction, Request, Response } from 'express';

import { validateTodo } from './errorHandler';


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
    it('should call next when title is valid and no dates are provided', () => {
      req.body = { title: 'Valid Title' };

      validateTodo(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next when title and valid dueDate are provided', () => {
      req.body = { title: 'Valid Title', dueDate: '2023-10-10' };

      validateTodo(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next when title and valid reminder are provided', () => {
      req.body = { title: 'Valid Title', reminder: '2023-10-10' };

      validateTodo(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next when title, valid dueDate, and valid reminder are provided', () => {
      req.body = { title: 'Valid Title', dueDate: '2023-10-10', reminder: '2023-10-10' };

      validateTodo(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should return 400 if title is missing', () => {
      req.body = {};

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if title is not a string', () => {
      req.body = { title: 123 };

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if title is an empty string', () => {
      req.body = { title: '' };

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid title' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if dueDate is invalid', () => {
      req.body = { title: 'Valid Title', dueDate: 'invalid-date' };

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid due date' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if reminder is invalid', () => {
      req.body = { title: 'Valid Title', reminder: 'invalid-date' };

      validateTodo(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid reminder date' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: validateTodo
