
// Unit tests for: run


import { IStatement, SQLiteStatement } from './SQLiteDatabase';


describe('SQLiteStatement.run() run method', () => {
  let mockStatement: any;
  let sqliteStatement: IStatement;

  beforeEach(() => {
    mockStatement = {
      run: jest.fn(),
    };
    sqliteStatement = new SQLiteStatement(mockStatement);
  });

  describe('Happy Path', () => {
    test('should execute run with provided parameters', () => {
      // Arrange
      const params = [1, 'test', true];
      (mockStatement.run as unknown as jest.Mock).mockReturnValue({ changes: 1 });

      // Act
      const result = sqliteStatement.run(...params);

      // Assert
      expect(mockStatement.run).toHaveBeenCalledWith(...params);
      expect(result).toEqual({ changes: 1 });
    });

    test('should execute run with no parameters', () => {
      // Arrange
      (mockStatement.run as unknown as jest.Mock).mockReturnValue({ changes: 1 });

      // Act
      const result = sqliteStatement.run();

      // Assert
      expect(mockStatement.run).toHaveBeenCalledWith();
      expect(result).toEqual({ changes: 1 });
    });
  });

  describe('Edge Cases', () => {
    test('should handle run with undefined parameters', () => {
      // Arrange
      const params = [undefined];
      (mockStatement.run as unknown as jest.Mock).mockReturnValue({ changes: 0 });

      // Act
      const result = sqliteStatement.run(...params);

      // Assert
      expect(mockStatement.run).toHaveBeenCalledWith(...params);
      expect(result).toEqual({ changes: 0 });
    });

    test('should handle run with null parameters', () => {
      // Arrange
      const params = [null];
      (mockStatement.run as unknown as jest.Mock).mockReturnValue({ changes: 0 });

      // Act
      const result = sqliteStatement.run(...params);

      // Assert
      expect(mockStatement.run).toHaveBeenCalledWith(...params);
      expect(result).toEqual({ changes: 0 });
    });

    test('should handle run with empty string parameters', () => {
      // Arrange
      const params = [''];
      (mockStatement.run as unknown as jest.Mock).mockReturnValue({ changes: 0 });

      // Act
      const result = sqliteStatement.run(...params);

      // Assert
      expect(mockStatement.run).toHaveBeenCalledWith(...params);
      expect(result).toEqual({ changes: 0 });
    });

    test('should handle run with special characters in parameters', () => {
      // Arrange
      const params = ['!@#$%^&*()'];
      (mockStatement.run as unknown as jest.Mock).mockReturnValue({ changes: 0 });

      // Act
      const result = sqliteStatement.run(...params);

      // Assert
      expect(mockStatement.run).toHaveBeenCalledWith(...params);
      expect(result).toEqual({ changes: 0 });
    });

    test('should handle run throwing an error', () => {
      // Arrange
      const params = [1, 'test', true];
      const errorMessage = 'Database error';
      (mockStatement.run as unknown as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      // Act & Assert
      expect(() => sqliteStatement.run(...params)).toThrowError(errorMessage);
    });
  });
});

// End of unit tests for: run
