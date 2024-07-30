
// Unit tests for: getCommentsByTodoId

import { Comment } from '../../models/comment';


import { CommentService, IDatabase, IStatement } from '../commentService';


describe('CommentService.getCommentsByTodoId() getCommentsByTodoId method', () => {
  let dbMock: jest.Mocked<IDatabase>;
  let statementMock: jest.Mocked<IStatement>;
  let commentService: CommentService;

  beforeEach(() => {
    statementMock = {
      run: jest.fn(),
      all: jest.fn(),
      get: jest.fn()
    };

    dbMock = {
      prepare: jest.fn().mockReturnValue(statementMock),
      exec: jest.fn()
    };

    commentService = new CommentService(dbMock);
  });

  describe('Happy Path', () => {
    it('should return comments for a given todoId', () => {
      // Arrange
      const todoId = 'todo-123';
      const comments: Comment[] = [
        { id: 'comment-1', todoId, content: 'First comment', timestamp: '2023-01-01T00:00:00Z' },
        { id: 'comment-2', todoId, content: 'Second comment', timestamp: '2023-01-02T00:00:00Z' }
      ];
      statementMock.all.mockReturnValue(comments);

      // Act
      const result = commentService.getCommentsByTodoId(todoId);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('SELECT * FROM comments WHERE todoId = ?');
      expect(statementMock.all).toHaveBeenCalled();
      expect(result).toEqual(comments);
    });
  });

  describe('Edge Cases', () => {
    it('should return an empty array if no comments are found for the given todoId', () => {
      // Arrange
      const todoId = 'todo-123';
      statementMock.all.mockReturnValue([]);

      // Act
      const result = commentService.getCommentsByTodoId(todoId);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('SELECT * FROM comments WHERE todoId = ?');
      expect(statementMock.all).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle SQL errors gracefully', () => {
      // Arrange
      const todoId = 'todo-123';
      statementMock.all.mockImplementation(() => {
        throw new Error('SQL error');
      });

      // Act & Assert
      expect(() => commentService.getCommentsByTodoId(todoId)).toThrow('SQL error');
      expect(dbMock.prepare).toHaveBeenCalledWith('SELECT * FROM comments WHERE todoId = ?');
      expect(statementMock.all).toHaveBeenCalled();
    });

    it('should handle invalid todoId gracefully', () => {
      // Arrange
      const todoId = '';
      statementMock.all.mockReturnValue([]);

      // Act
      const result = commentService.getCommentsByTodoId(todoId);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('SELECT * FROM comments WHERE todoId = ?');
      expect(statementMock.all).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});

// End of unit tests for: getCommentsByTodoId
