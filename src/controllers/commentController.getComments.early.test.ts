
// Unit tests for: getComments

import { Request, Response } from 'express';


import { getComments } from './commentController';


class MockCommentService {
  public getCommentsByTodoId = jest.fn();
}

describe('getComments() getComments method', () => {
  let mockCommentService: MockCommentService;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    mockCommentService = new MockCommentService();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = {
      params: {}
    };
    res = {
      status: statusMock
    };
  });

  describe('Happy Path', () => {
    it('should return comments with status 200 when comments are found', async () => {
      // Arrange
      req.params = { todoId: '1' };
      const comments = [{ id: 1, content: 'Test comment' }];
      (mockCommentService.getCommentsByTodoId as unknown as jest.Mock).mockResolvedValue(comments as any as never);

      // Act
      await getComments(mockCommentService as any)(req as Request, res as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(comments);
    });
  });

  describe('Edge Cases', () => {
    it('should return 400 if todoId is not provided', async () => {
      // Arrange
      req.params = {};

      // Act
      await getComments(mockCommentService as any)(req as Request, res as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid request: todoId is required' });
    });

    it('should return 404 if no comments are found', async () => {
      // Arrange
      req.params = { todoId: '1' };
      (mockCommentService.getCommentsByTodoId as unknown as jest.Mock).mockResolvedValue([] as any as never);

      // Act
      await getComments(mockCommentService as any)(req as Request, res as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Comments not found' });
    });

    it('should return 500 if an error occurs', async () => {
      // Arrange
      req.params = { todoId: '1' };
      (mockCommentService.getCommentsByTodoId as unknown as jest.Mock).mockRejectedValue(new Error('Internal Server Error') as never);

      // Act
      await getComments(mockCommentService as any)(req as Request, res as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});

// End of unit tests for: getComments
