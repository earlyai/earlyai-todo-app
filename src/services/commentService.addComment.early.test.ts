
// Unit tests for: addComment


import { v4 as uuidv4 } from 'uuid';

import { CommentService, IDatabase, IStatement } from './commentService';


jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('CommentService.addComment() addComment method', () => {
  let dbMock: IDatabase;
  let statementMock: IStatement;
  let commentService: CommentService;

  beforeEach(() => {
    statementMock = {
      run: jest.fn(),
      all: jest.fn(),
      get: jest.fn(),
    };

    dbMock = {
      prepare: jest.fn().mockReturnValue(statementMock),
      exec: jest.fn(),
    };

    commentService = new CommentService(dbMock);
  });

  describe('Happy Path', () => {
    it('should add a comment successfully', () => {
      // Arrange
      const todoId = 'todo-123';
      const content = 'This is a comment';
      const commentId = 'comment-123';
      const timestamp = new Date().toISOString();

      (uuidv4 as unknown as jest.Mock).mockReturnValue(commentId);

      // Act
      const result = commentService.addComment(todoId, content);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('INSERT INTO comments (id, todoId, content, timestamp) VALUES (?, ?, ?, ?)');
      expect(statementMock.run).toHaveBeenCalledWith(commentId, todoId, content, timestamp);
      expect(result).toEqual({
        id: commentId,
        todoId,
        content,
        timestamp,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      // Arrange
      const todoId = 'todo-123';
      const content = '';
      const commentId = 'comment-123';
      const timestamp = new Date().toISOString();

      (uuidv4 as unknown as jest.Mock).mockReturnValue(commentId);

      // Act
      const result = commentService.addComment(todoId, content);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('INSERT INTO comments (id, todoId, content, timestamp) VALUES (?, ?, ?, ?)');
      expect(statementMock.run).toHaveBeenCalledWith(commentId, todoId, content, timestamp);
      expect(result).toEqual({
        id: commentId,
        todoId,
        content,
        timestamp,
      });
    });

    it('should handle empty todoId', () => {
      // Arrange
      const todoId = '';
      const content = 'This is a comment';
      const commentId = 'comment-123';
      const timestamp = new Date().toISOString();

      (uuidv4 as unknown as jest.Mock).mockReturnValue(commentId);

      // Act
      const result = commentService.addComment(todoId, content);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('INSERT INTO comments (id, todoId, content, timestamp) VALUES (?, ?, ?, ?)');
      expect(statementMock.run).toHaveBeenCalledWith(commentId, todoId, content, timestamp);
      expect(result).toEqual({
        id: commentId,
        todoId,
        content,
        timestamp,
      });
    });

    it('should handle database insertion error', () => {
      // Arrange
      const todoId = 'todo-123';
      const content = 'This is a comment';
      const commentId = 'comment-123';
      const timestamp = new Date().toISOString();

      (uuidv4 as unknown as jest.Mock).mockReturnValue(commentId);
      (statementMock.run as unknown as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      // Act & Assert
      expect(() => commentService.addComment(todoId, content)).toThrow('Database error');
    });
  });
});

// End of unit tests for: addComment
