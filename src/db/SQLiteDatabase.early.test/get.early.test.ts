
// Unit tests for: get


import { IStatement, SQLiteStatement } from '../SQLiteDatabase';


jest.mock("better-sqlite3", () => {
  return {
    Database: jest.fn().mockImplementation(() => ({
      prepare: jest.fn().mockReturnValue({
        get: jest.fn(),
        run: jest.fn(),
        all: jest.fn(),
      }),
    })),
  };
});

describe('SQLiteStatement.get() get method', () => {
  let mockStatement: any;
  let sqliteStatement: IStatement;

  beforeEach(() => {
    mockStatement = {
      get: jest.fn(),
    };
    sqliteStatement = new SQLiteStatement(mockStatement);
  });

  describe('Happy Path', () => {
    test('should return a single row when parameters are provided', () => {
      // Arrange
      const expectedRow = { id: 1, name: 'John Doe' };
      mockStatement.get.mockReturnValue(expectedRow);

      // Act
      const result = sqliteStatement.get(1);

      // Assert
      expect(result).toEqual(expectedRow);
      expect(mockStatement.get).toHaveBeenCalledWith(1);
    });

    test('should return a single row when no parameters are provided', () => {
      // Arrange
      const expectedRow = { id: 1, name: 'John Doe' };
      mockStatement.get.mockReturnValue(expectedRow);

      // Act
      const result = sqliteStatement.get();

      // Assert
      expect(result).toEqual(expectedRow);
      expect(mockStatement.get).toHaveBeenCalledWith();
    });
  });

  describe('Edge Cases', () => {
    test('should return undefined when no row matches the parameters', () => {
      // Arrange
      mockStatement.get.mockReturnValue(undefined);

      // Act
      const result = sqliteStatement.get(999);

      // Assert
      expect(result).toBeUndefined();
      expect(mockStatement.get).toHaveBeenCalledWith(999);
    });

    test('should handle null parameters gracefully', () => {
      // Arrange
      const expectedRow = { id: 1, name: 'John Doe' };
      mockStatement.get.mockReturnValue(expectedRow);

      // Act
      const result = sqliteStatement.get(null);

      // Assert
      expect(result).toEqual(expectedRow);
      expect(mockStatement.get).toHaveBeenCalledWith(null);
    });

    test('should handle multiple parameters correctly', () => {
      // Arrange
      const expectedRow = { id: 1, name: 'John Doe' };
      mockStatement.get.mockReturnValue(expectedRow);

      // Act
      const result = sqliteStatement.get(1, 'John Doe');

      // Assert
      expect(result).toEqual(expectedRow);
      expect(mockStatement.get).toHaveBeenCalledWith(1, 'John Doe');
    });

    test('should handle empty parameters array', () => {
      // Arrange
      const expectedRow = { id: 1, name: 'John Doe' };
      mockStatement.get.mockReturnValue(expectedRow);

      // Act
      const result = sqliteStatement.get(...[]);

      // Assert
      expect(result).toEqual(expectedRow);
      expect(mockStatement.get).toHaveBeenCalledWith();
    });

    test('should throw an error if the underlying statement throws an error', () => {
      // Arrange
      const errorMessage = 'Database error';
      mockStatement.get.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      // Act & Assert
      expect(() => sqliteStatement.get(1)).toThrow(errorMessage);
      expect(mockStatement.get).toHaveBeenCalledWith(1);
    });
  });
});

// End of unit tests for: get
