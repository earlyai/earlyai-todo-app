import { Request, Response, NextFunction } from 'express';

export const validateTodo = (req: Request, res: Response, next: NextFunction): void => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ message: 'Invalid title' });
  } else {
    next();
  }
};