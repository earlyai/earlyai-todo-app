
// Unit tests for: getComments

import { Request, Response } from 'express';


import { getComments } from '../commentController';


// MockCommentService.ts
class MockCommentService {
  public getCommentsByTodoId = jest.fn();
}

describe('getComments() getComments method', () => {
  let mockCommentService: MockCommentService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    mockCommentService = new MockCommentService() as any;
    req = {
      params: {}
    } as any;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;
  });

  describe('Happy Path', () => {
    it('should return comments with status 200 when comments are found', async () => {
      // Arrange
      const comments = [{ id: 1, text: 'Test comment' }];
      req.params.todoId = '1';
      mockCommentService.getCommentsByTodoId.mockResolvedValue(comments as any as never);

      // Act
      await getComments(mockCommentService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(comments);
    });
  });

  describe('Edge Cases', () => {
    it('should return status 400 when todoId is not provided', async () => {
      // Arrange
      req.params.todoId = '';

      // Act
      await getComments(mockCommentService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid request: todoId is required' });
    });

    it('should return status 404 when no comments are found', async () => {
      // Arrange
      req.params.todoId = '1';
      mockCommentService.getCommentsByTodoId.mockResolvedValue([] as any as never);

      // Act
      await getComments(mockCommentService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Comments not found' });
    });

    it('should return status 500 when an error occurs', async () => {
      // Arrange
      req.params.todoId = '1';
      mockCommentService.getCommentsByTodoId.mockRejectedValue(new Error('Test error') as never);

      // Act
      await getComments(mockCommentService as any)(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});

// End of unit tests for: getComments
