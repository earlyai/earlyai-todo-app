
// Unit tests for: deleteComment

import { Request, Response } from 'express';


import { deleteComment } from '../commentController';


// Mock class for CommentService
class MockCommentService {
  public deleteComment = jest.fn();
}

describe('deleteComment() deleteComment method', () => {
  let mockCommentService: MockCommentService;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    mockCommentService = new MockCommentService();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = { params: {} };
    res = { status: statusMock } as any;
  });

  describe('Happy Path', () => {
    it('should delete the comment and return 204 status with "Comment deleted" message', async () => {
      // Arrange
      req.params = { id: '123' };
      mockCommentService.deleteComment.mockReturnValue(true as any);

      // Act
      await deleteComment(mockCommentService as any)(req as Request, res as Response);

      // Assert
      expect(mockCommentService.deleteComment).toHaveBeenCalledWith('123');
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Comment deleted' });
    });

    it('should return 204 status with "Comment not found" message if comment does not exist', async () => {
      // Arrange
      req.params = { id: '123' };
      mockCommentService.deleteComment.mockReturnValue(false as any);

      // Act
      await deleteComment(mockCommentService as any)(req as Request, res as Response);

      // Assert
      expect(mockCommentService.deleteComment).toHaveBeenCalledWith('123');
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Comment not found' });
    });
  });

  describe('Edge Cases', () => {
    it('should return 400 status with "Invalid request, comment ID is missing" message if id is not provided', async () => {
      // Arrange
      req.params = {};

      // Act
      await deleteComment(mockCommentService as any)(req as Request, res as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid request, comment ID is missing' });
    });

    it('should return 500 status with "Internal Server Error" message if an exception is thrown', async () => {
      // Arrange
      req.params = { id: '123' };
      mockCommentService.deleteComment.mockImplementation(() => {
        throw new Error('Test error');
      });

      // Act
      await deleteComment(mockCommentService as any)(req as Request, res as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});

// End of unit tests for: deleteComment
