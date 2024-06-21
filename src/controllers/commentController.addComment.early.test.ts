
// Unit tests for: addComment

import { Request, Response } from 'express';


import { addComment } from './commentController';


// MockCommentService.ts
export class MockCommentService {
  public addComment = jest.fn();
}

describe('addComment() addComment method', () => {
  let mockCommentService: MockCommentService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    mockCommentService = new MockCommentService();
    req = {
      params: {},
      body: {}
    } as any;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;
  });

  describe('Happy Path', () => {
    it('should add a comment and return 201 status with the new comment', async () => {
      // Arrange
      req.params.todoId = '1';
      req.body.content = 'This is a comment';
      const newComment = { id: '1', todoId: '1', content: 'This is a comment' };
      (mockCommentService.addComment as unknown as jest.Mock).mockResolvedValue(newComment as any as never);

      // Act
      await addComment(mockCommentService as any)(req, res);

      // Assert
      expect(mockCommentService.addComment).toHaveBeenCalledWith('1', 'This is a comment');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newComment);
    });
  });

  describe('Edge Cases', () => {
    it('should return 400 if todoId is missing', async () => {
      // Arrange
      req.body.content = 'This is a comment';

      // Act
      await addComment(mockCommentService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid request: todoId and content are required' });
    });

    it('should return 400 if content is missing', async () => {
      // Arrange
      req.params.todoId = '1';

      // Act
      await addComment(mockCommentService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid request: todoId and content are required' });
    });

    it('should return 500 if an error occurs in the service', async () => {
      // Arrange
      req.params.todoId = '1';
      req.body.content = 'This is a comment';
      (mockCommentService.addComment as unknown as jest.Mock).mockRejectedValue(new Error('Service error') as never);

      // Act
      await addComment(mockCommentService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});

// End of unit tests for: addComment
