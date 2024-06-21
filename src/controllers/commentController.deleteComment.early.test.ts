
// Unit tests for: deleteComment

import { Request, Response } from 'express';


import { deleteComment } from './commentController';


class MockCommentService {
  public deleteComment = jest.fn();
}

describe('deleteComment() deleteComment method', () => {
  let mockCommentService: MockCommentService;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let status: jest.Mock;
  let json: jest.Mock;

  beforeEach(() => {
    mockCommentService = new MockCommentService();
    status = jest.fn().mockReturnValue({ json: jest.fn() });
    json = jest.fn();
    res = {
      status,
      json,
    };
  });

  describe('Happy Path', () => {
    it('should delete a comment and return 204 status when comment is successfully deleted', async () => {
      // Arrange
      req = { params: { id: '123' } };
      (mockCommentService.deleteComment as unknown as jest.Mock).mockReturnValue(true);

      // Act
      await deleteComment(mockCommentService as any)(req as Request, res as Response);

      // Assert
      expect(mockCommentService.deleteComment).toHaveBeenCalledWith('123');
      expect(status).toHaveBeenCalledWith(204);
      expect(json).toHaveBeenCalledWith({ message: 'Comment deleted' });
    });

    it('should return 204 status with "Comment not found" message when comment does not exist', async () => {
      // Arrange
      req = { params: { id: '123' } };
      (mockCommentService.deleteComment as unknown as jest.Mock).mockReturnValue(false);

      // Act
      await deleteComment(mockCommentService as any)(req as Request, res as Response);

      // Assert
      expect(mockCommentService.deleteComment).toHaveBeenCalledWith('123');
      expect(status).toHaveBeenCalledWith(204);
      expect(json).toHaveBeenCalledWith({ message: 'Comment not found' });
    });
  });

  describe('Edge Cases', () => {
    it('should return 400 status when comment ID is missing', async () => {
      // Arrange
      req = { params: {} };

      // Act
      await deleteComment(mockCommentService as any)(req as Request, res as Response);

      // Assert
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'Invalid request, comment ID is missing' });
    });

    it('should return 500 status when an error occurs', async () => {
      // Arrange
      req = { params: { id: '123' } };
      (mockCommentService.deleteComment as unknown as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });

      // Act
      await deleteComment(mockCommentService as any)(req as Request, res as Response);

      // Assert
      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});

// End of unit tests for: deleteComment
