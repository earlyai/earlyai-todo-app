
// Unit tests for: addComment

import { Comment } from '../../models/comment';

import { v4 as uuidv4 } from 'uuid';

import { CommentService, IDatabase, IStatement } from '../commentService';


jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe('CommentService.addComment() addComment method', () => {
  let dbMock: jest.Mocked<IDatabase>;
  let statementMock: jest.Mocked<IStatement>;
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
      const mockId = 'uuid-123';
      const mockTimestamp = '2023-10-01T00:00:00.000Z';
      const expectedComment: Comment = {
        id: mockId,
        todoId,
        content,
        timestamp: mockTimestamp,
      };

      (uuidv4 as jest.Mock).mockReturnValue(mockId);
      jest.spyOn(global, 'Date').mockImplementation(() => ({
        toISOString: () => mockTimestamp,
      } as unknown as Date));

      // Act
      const result = commentService.addComment(todoId, content);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('INSERT INTO comments (id, todoId, content, timestamp) VALUES (?, ?, ?, ?)');
      expect(statementMock.run).toHaveBeenCalledWith(mockId, todoId, content, mockTimestamp);
      expect(result).toEqual(expectedComment);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      // Arrange
      const todoId = 'todo-123';
      const content = '';
      const mockId = 'uuid-123';
      const mockTimestamp = '2023-10-01T00:00:00.000Z';
      const expectedComment: Comment = {
        id: mockId,
        todoId,
        content,
        timestamp: mockTimestamp,
      };

      (uuidv4 as jest.Mock).mockReturnValue(mockId);
      jest.spyOn(global, 'Date').mockImplementation(() => ({
        toISOString: () => mockTimestamp,
      } as unknown as Date));

      // Act
      const result = commentService.addComment(todoId, content);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('INSERT INTO comments (id, todoId, content, timestamp) VALUES (?, ?, ?, ?)');
      expect(statementMock.run).toHaveBeenCalledWith(mockId, todoId, content, mockTimestamp);
      expect(result).toEqual(expectedComment);
    });

    it('should handle very long content', () => {
      // Arrange
      const todoId = 'todo-123';
      const content = 'a'.repeat(1000); // Very long content
      const mockId = 'uuid-123';
      const mockTimestamp = '2023-10-01T00:00:00.000Z';
      const expectedComment: Comment = {
        id: mockId,
        todoId,
        content,
        timestamp: mockTimestamp,
      };

      (uuidv4 as jest.Mock).mockReturnValue(mockId);
      jest.spyOn(global, 'Date').mockImplementation(() => ({
        toISOString: () => mockTimestamp,
      } as unknown as Date));

      // Act
      const result = commentService.addComment(todoId, content);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('INSERT INTO comments (id, todoId, content, timestamp) VALUES (?, ?, ?, ?)');
      expect(statementMock.run).toHaveBeenCalledWith(mockId, todoId, content, mockTimestamp);
      expect(result).toEqual(expectedComment);
    });

    it('should handle special characters in content', () => {
      // Arrange
      const todoId = 'todo-123';
      const content = 'This is a comment with special characters !@#$%^&*()';
      const mockId = 'uuid-123';
      const mockTimestamp = '2023-10-01T00:00:00.000Z';
      const expectedComment: Comment = {
        id: mockId,
        todoId,
        content,
        timestamp: mockTimestamp,
      };

      (uuidv4 as jest.Mock).mockReturnValue(mockId);
      jest.spyOn(global, 'Date').mockImplementation(() => ({
        toISOString: () => mockTimestamp,
      } as unknown as Date));

      // Act
      const result = commentService.addComment(todoId, content);

      // Assert
      expect(dbMock.prepare).toHaveBeenCalledWith('INSERT INTO comments (id, todoId, content, timestamp) VALUES (?, ?, ?, ?)');
      expect(statementMock.run).toHaveBeenCalledWith(mockId, todoId, content, mockTimestamp);
      expect(result).toEqual(expectedComment);
    });

    it('should handle database insertion failure', () => {
      // Arrange
      const todoId = 'todo-123';
      const content = 'This is a comment';
      const mockId = 'uuid-123';
      const mockTimestamp = '2023-10-01T00:00:00.000Z';

      (uuidv4 as jest.Mock).mockReturnValue(mockId);
      jest.spyOn(global, 'Date').mockImplementation(() => ({
        toISOString: () => mockTimestamp,
      } as unknown as Date));

      statementMock.run.mockImplementation(() => {
        throw new Error('Database insertion failed');
      });

      // Act & Assert
      expect(() => commentService.addComment(todoId, content)).toThrow('Database insertion failed');
    });
  });
});

// End of unit tests for: addComment
