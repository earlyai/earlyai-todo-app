
// Unit tests for: deleteComment



import { CommentService, IDatabase, IStatement } from '../commentService';


jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe('CommentService.deleteComment() deleteComment method', () => {
  let dbMock: jest.Mocked<IDatabase>;
  let stmtMock: jest.Mocked<IStatement>;
  let commentService: CommentService;

  beforeEach(() => {
    stmtMock = {
      run: jest.fn(),
      all: jest.fn(),
      get: jest.fn(),
    };

    dbMock = {
      prepare: jest.fn().mockReturnValue(stmtMock),
      exec: jest.fn(),
    };

    commentService = new CommentService(dbMock);
  });

  describe('Happy Path', () => {
    it('should delete a comment and return true when the comment exists', () => {
      // Arrange
      const commentId = 'existing-comment-id';
      stmtMock.run.mockReturnValue({ changes: 1 });

      // Act
      const result = commentService.deleteComment(commentId);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('DELETE FROM comments WHERE id = ?');
      expect(stmtMock.run).toHaveBeenCalledWith(commentId);
      expect(result).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should return false when the comment does not exist', () => {
      // Arrange
      const nonExistentCommentId = 'non-existent-comment-id';
      stmtMock.run.mockReturnValue({ changes: 0 });

      // Act
      const result = commentService.deleteComment(nonExistentCommentId);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('DELETE FROM comments WHERE id = ?');
      expect(stmtMock.run).toHaveBeenCalledWith(nonExistentCommentId);
      expect(result).toBe(false);
    });

    it('should handle empty string as comment id gracefully', () => {
      // Arrange
      const emptyCommentId = '';
      stmtMock.run.mockReturnValue({ changes: 0 });

      // Act
      const result = commentService.deleteComment(emptyCommentId);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('DELETE FROM comments WHERE id = ?');
      expect(stmtMock.run).toHaveBeenCalledWith(emptyCommentId);
      expect(result).toBe(false);
    });

    it('should handle null as comment id gracefully', () => {
      // Arrange
      const nullCommentId = null;
      stmtMock.run.mockReturnValue({ changes: 0 });

      // Act
      const result = commentService.deleteComment(nullCommentId as unknown as string);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('DELETE FROM comments WHERE id = ?');
      expect(stmtMock.run).toHaveBeenCalledWith(nullCommentId);
      expect(result).toBe(false);
    });

    it('should handle undefined as comment id gracefully', () => {
      // Arrange
      const undefinedCommentId = undefined;
      stmtMock.run.mockReturnValue({ changes: 0 });

      // Act
      const result = commentService.deleteComment(undefinedCommentId as unknown as string);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('DELETE FROM comments WHERE id = ?');
      expect(stmtMock.run).toHaveBeenCalledWith(undefinedCommentId);
      expect(result).toBe(false);
    });

    it('should handle SQL injection attempt gracefully', () => {
      // Arrange
      const sqlInjectionAttempt = "'; DROP TABLE comments; --";
      stmtMock.run.mockReturnValue({ changes: 0 });

      // Act
      const result = commentService.deleteComment(sqlInjectionAttempt);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('DELETE FROM comments WHERE id = ?');
      expect(stmtMock.run).toHaveBeenCalledWith(sqlInjectionAttempt);
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: deleteComment
