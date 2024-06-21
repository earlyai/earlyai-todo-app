
// Unit tests for: deleteComment



import { CommentService, IDatabase, IStatement } from './commentService';


describe('CommentService.deleteComment() deleteComment method', () => {
  let dbMock: IDatabase;
  let stmtMock: IStatement;
  let commentService: CommentService;

  beforeEach(() => {
    stmtMock = {
      run: jest.fn(),
      all: jest.fn(),
      get: jest.fn()
    };

    dbMock = {
      prepare: jest.fn().mockReturnValue(stmtMock),
      exec: jest.fn()
    };

    commentService = new CommentService(dbMock);
  });

  describe('Happy Path', () => {
    it('should delete a comment and return true when the comment exists', () => {
      // Arrange
      const commentId = 'existing-comment-id';
      (stmtMock.run as unknown as jest.Mock).mockReturnValue({ changes: 1 });

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
      const commentId = 'non-existing-comment-id';
      (stmtMock.run as unknown as jest.Mock).mockReturnValue({ changes: 0 });

      // Act
      const result = commentService.deleteComment(commentId);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('DELETE FROM comments WHERE id = ?');
      expect(stmtMock.run).toHaveBeenCalledWith(commentId);
      expect(result).toBe(false);
    });

    it('should handle SQL errors gracefully', () => {
      // Arrange
      const commentId = 'comment-id';
      (stmtMock.run as unknown as jest.Mock).mockImplementation(() => {
        throw new Error('SQL error');
      });

      // Act & Assert
      expect(() => commentService.deleteComment(commentId)).toThrow('SQL error');
      expect(dbMock.prepare).toHaveBeenCalledWith('DELETE FROM comments WHERE id = ?');
      expect(stmtMock.run).toHaveBeenCalledWith(commentId);
    });

    it('should handle empty comment ID', () => {
      // Arrange
      const commentId = '';
      (stmtMock.run as unknown as jest.Mock).mockReturnValue({ changes: 0 });

      // Act
      const result = commentService.deleteComment(commentId);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('DELETE FROM comments WHERE id = ?');
      expect(stmtMock.run).toHaveBeenCalledWith(commentId);
      expect(result).toBe(false);
    });

//    it('should handle null comment ID', () => {
//      // Arrange
//      const commentId = null;
//      (stmtMock.run as unknown as jest.Mock).mockReturnValue({ changes: 0 });
//
//      // Act
//      const result = commentService.deleteComment(commentId);
//
//      // Assert
//      expect(dbMock.prepare).toHaveBeenCalledWith('DELETE FROM comments WHERE id = ?');
//      expect(stmtMock.run).toHaveBeenCalledWith(commentId);
//      expect(result).toBe(false);
//    });

//    it('should handle undefined comment ID', () => {
//      // Arrange
//      const commentId = undefined;
//      (stmtMock.run as unknown as jest.Mock).mockReturnValue({ changes: 0 });
//
//      // Act
//      const result = commentService.deleteComment(commentId);
//
//      // Assert
//      expect(dbMock.prepare).toHaveBeenCalledWith('DELETE FROM comments WHERE id = ?');
//      expect(stmtMock.run).toHaveBeenCalledWith(commentId);
//      expect(result).toBe(false);
//    });
  });
});

// End of unit tests for: deleteComment
