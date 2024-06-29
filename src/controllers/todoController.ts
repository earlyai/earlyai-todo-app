import { Request, Response } from 'express';
import { TodoService } from '../services/todoService';
import { Todo } from '../models/todo';

export type SortableFields = 'title' | 'priority' | 'dueDate' | 'reminder' | 'completed';

const _formatTodo = (todo: Todo): string => {
  return `${todo.id}: ${todo.title} [${todo.completed ? 'Completed' : 'Pending'}] - Due: ${todo.dueDate ? todo.dueDate.toLocaleDateString() : 'No due date'} - Reminder: ${todo.reminder ? todo.reminder.toLocaleDateString() : 'No reminder'}`;
};

export const getTodos = (todoService: TodoService) => (req: Request, res: Response): void => {
  try {
    const { sortBy, completed, priority } = req.query || {};
    const filterBy: { completed?: boolean; priority?: string } = {};

    if (completed !== undefined) {
      filterBy.completed = completed === 'true';
    }

    if (priority) {
      filterBy.priority = priority as string;
    }

    let sortField: SortableFields | undefined;
    if (typeof sortBy === 'string' && ['title', 'priority', 'dueDate', 'reminder', 'completed'].includes(sortBy)) {
      sortField = sortBy as SortableFields;
    }

    const todos = todoService.getAllTodos(sortField, filterBy);
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/*
Geneate suffieicent Happy path unit tests
And create  Edge cases for:
1. Invalidate date format
2. Missing title
3. Service rrror
*/
export const createTodoSignitureOnly = (todoService: TodoService) => (req: Request, res: Response): void => {
  try {
    // todo: no implementation yet...
    const newTodo = {}
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createTodo = (todoService: TodoService) => (req: Request, res: Response): void => {
  try {
    const { title, priority, dueDate, reminder } = req.body;
    const newTodo = todoService.createTodo(title, priority, dueDate ? new Date(dueDate) : undefined, reminder ? new Date(reminder) : undefined);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//this method calling the updateTodo(title: string, priority: 'low' | 'medium' | 'high' = 'low', dueDate?: Date, reminder?: Date)
export const updateTodo = (todoService: TodoService) => (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { title, completed, priority, dueDate, reminder } = req.body;
    const updatedTodo = todoService.updateTodo(id, { title, completed, priority, dueDate: dueDate ? new Date(dueDate) : undefined, reminder: reminder ? new Date(reminder) : undefined });
    if (updatedTodo) {
      res.status(200).json(updatedTodo);
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteTodo = (todoService: TodoService) => (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const isDeleted = todoService.deleteTodo(id);
    if (isDeleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getFormattedTodos = (todoService: TodoService) => (req: Request, res: Response): void => {
  try {
    const todos = todoService.getAllTodos();
    const formattedTodos = todos.map(_formatTodo);
    res.status(200).json(formattedTodos);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};