import { Request, Response, NextFunction } from 'express';

export const validateTodo = (req: Request, res: Response, next: NextFunction): void => {
  const { title, dueDate, reminder } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ message: 'Invalid title' });
  } else if (dueDate && isNaN(Date.parse(dueDate))) {
    res.status(400).json({ message: 'Invalid due date' });
  } else if (reminder && isNaN(Date.parse(reminder))) {
    res.status(400).json({ message: 'Invalid reminder date' });
  } else {
    next();
  }
};