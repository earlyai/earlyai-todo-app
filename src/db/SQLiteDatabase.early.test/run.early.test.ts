
// Unit tests for: run


import { IStatement, SQLiteStatement } from '../SQLiteDatabase';


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
    test('should execute run with no parameters', () => {
      // Arrange
      const expectedResult = { changes: 1 };
      mockStatement.run.mockReturnValue(expectedResult);

      // Act
      const result = sqliteStatement.run();

      // Assert
      expect(mockStatement.run).toHaveBeenCalledWith();
      expect(result).toBe(expectedResult);
    });

    test('should execute run with multiple parameters', () => {
      // Arrange
      const params = [1, 'test', true];
      const expectedResult = { changes: 1 };
      mockStatement.run.mockReturnValue(expectedResult);

      // Act
      const result = sqliteStatement.run(...params);

      // Assert
      expect(mockStatement.run).toHaveBeenCalledWith(...params);
      expect(result).toBe(expectedResult);
    });
  });

  describe('Edge Cases', () => {
    test('should handle run with undefined parameter', () => {
      // Arrange
      const params = [undefined];
      const expectedResult = { changes: 0 };
      mockStatement.run.mockReturnValue(expectedResult);

      // Act
      const result = sqliteStatement.run(...params);

      // Assert
      expect(mockStatement.run).toHaveBeenCalledWith(...params);
      expect(result).toBe(expectedResult);
    });

    test('should handle run with null parameter', () => {
      // Arrange
      const params = [null];
      const expectedResult = { changes: 0 };
      mockStatement.run.mockReturnValue(expectedResult);

      // Act
      const result = sqliteStatement.run(...params);

      // Assert
      expect(mockStatement.run).toHaveBeenCalledWith(...params);
      expect(result).toBe(expectedResult);
    });

    test('should handle run with empty string parameter', () => {
      // Arrange
      const params = [''];
      const expectedResult = { changes: 0 };
      mockStatement.run.mockReturnValue(expectedResult);

      // Act
      const result = sqliteStatement.run(...params);

      // Assert
      expect(mockStatement.run).toHaveBeenCalledWith(...params);
      expect(result).toBe(expectedResult);
    });

    test('should handle run with special characters in parameters', () => {
      // Arrange
      const params = ['!@#$%^&*()'];
      const expectedResult = { changes: 0 };
      mockStatement.run.mockReturnValue(expectedResult);

      // Act
      const result = sqliteStatement.run(...params);

      // Assert
      expect(mockStatement.run).toHaveBeenCalledWith(...params);
      expect(result).toBe(expectedResult);
    });

    test('should handle run with large number of parameters', () => {
      // Arrange
      const params = new Array(1000).fill('param');
      const expectedResult = { changes: 0 };
      mockStatement.run.mockReturnValue(expectedResult);

      // Act
      const result = sqliteStatement.run(...params);

      // Assert
      expect(mockStatement.run).toHaveBeenCalledWith(...params);
      expect(result).toBe(expectedResult);
    });

    test('should handle run throwing an error', () => {
      // Arrange
      const params = [1, 'test', true];
      const errorMessage = 'Database error';
      mockStatement.run.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      // Act & Assert
      expect(() => sqliteStatement.run(...params)).toThrow(errorMessage);
    });
  });
});

// End of unit tests for: run
