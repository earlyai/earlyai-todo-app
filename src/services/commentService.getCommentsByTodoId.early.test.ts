
// Unit tests for: getCommentsByTodoId

import { Comment } from '../models/comment';


import { CommentService, IDatabase, IStatement } from './commentService';


jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('CommentService.getCommentsByTodoId() getCommentsByTodoId method', () => {
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
    it('should return comments for a given todoId', () => {
      // Arrange
      const todoId = '123';
      const comments: Comment[] = [
        { id: '1', todoId: '123', content: 'Test comment 1', timestamp: '2023-01-01T00:00:00Z' },
        { id: '2', todoId: '123', content: 'Test comment 2', timestamp: '2023-01-02T00:00:00Z' },
      ];
      (statementMock.all as unknown as jest.Mock).mockReturnValue(comments);

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
      const todoId = '123';
      (statementMock.all as unknown as jest.Mock).mockReturnValue([]);

      // Act
      const result = commentService.getCommentsByTodoId(todoId);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('SELECT * FROM comments WHERE todoId = ?');
      expect(statementMock.all).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle SQL errors gracefully', () => {
      // Arrange
      const todoId = '123';
      (statementMock.all as unknown as jest.Mock).mockImplementation(() => {
        throw new Error('SQL error');
      });

      // Act & Assert
      expect(() => commentService.getCommentsByTodoId(todoId)).toThrow('SQL error');
      expect(dbMock.prepare).toHaveBeenCalledWith('SELECT * FROM comments WHERE todoId = ?');
      expect(statementMock.all).toHaveBeenCalled();
    });

    it('should handle invalid todoId input gracefully', () => {
      // Arrange
      const todoId = '';
      (statementMock.all as unknown as jest.Mock).mockReturnValue([]);

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
