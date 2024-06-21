import { Request, Response } from 'express';
import { CommentService } from '../services/commentService';

export const getComments = (commentService: CommentService) => async (req: Request, res: Response): Promise<void> => {
  try {
    const { todoId } = req.params;

    if (!todoId) {
      res.status(400).json({ message: 'Invalid request: todoId is required' });
      return;
    }

    const comments = await commentService.getCommentsByTodoId(todoId); // Await the promise
    if (comments.length > 0) {
      res.status(200).json(comments);
    } else {
      res.status(404).json({ message: 'Comments not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const addComment = (commentService: CommentService) => async (req: Request, res: Response): Promise<void> => {
  try {
    const { todoId } = req.params;
    const { content } = req.body;

    if (!todoId || !content) {
      res.status(400).json({ message: 'Invalid request: todoId and content are required' });
      return;
    }

    const newComment = await commentService.addComment(todoId, content);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// calling deleteComment(id: string): boolean method of CommentService
export const deleteComment = (commentService: CommentService) => async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params || {};
    if (!id) {
      res.status(400).json({ message: 'Invalid request, comment ID is missing' });
      return;
    }

    const isDeleted = commentService.deleteComment(id);
    if (isDeleted) {
      res.status(204).json({ message: 'Comment deleted' });
    } else {
      res.status(204).json({ message: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};