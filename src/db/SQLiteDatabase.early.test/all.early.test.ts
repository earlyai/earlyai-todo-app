
// Unit tests for: all


import { IStatement, SQLiteStatement } from '../SQLiteDatabase';


jest.mock("better-sqlite3", () => {
  return {
    Database: jest.fn().mockImplementation(() => ({
      prepare: jest.fn(),
      exec: jest.fn(),
    })),
  };
});

describe('SQLiteStatement.all() all method', () => {
  let mockStatement: any;
  let sqliteStatement: IStatement;

  beforeEach(() => {
    mockStatement = {
      all: jest.fn(),
    };
    sqliteStatement = new SQLiteStatement(mockStatement);
  });

  describe('Happy Path', () => {
    test('should return an array of results when the statement executes successfully', () => {
      // Arrange
      const expectedResults = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
      mockStatement.all.mockReturnValue(expectedResults);

      // Act
      const results = sqliteStatement.all();

      // Assert
      expect(results).toEqual(expectedResults);
      expect(mockStatement.all).toHaveBeenCalledTimes(1);
    });

    test('should return an empty array when there are no results', () => {
      // Arrange
      const expectedResults: any[] = [];
      mockStatement.all.mockReturnValue(expectedResults);

      // Act
      const results = sqliteStatement.all();

      // Assert
      expect(results).toEqual(expectedResults);
      expect(mockStatement.all).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    test('should handle the case when the statement returns a large number of results', () => {
      // Arrange
      const largeResults = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Name${i}` }));
      mockStatement.all.mockReturnValue(largeResults);

      // Act
      const results = sqliteStatement.all();

      // Assert
      expect(results).toEqual(largeResults);
      expect(mockStatement.all).toHaveBeenCalledTimes(1);
    });

    test('should handle the case when the statement returns results with various data types', () => {
      // Arrange
      const mixedResults = [{ id: 1, name: 'Alice', active: true }, { id: 2, name: 'Bob', active: false }];
      mockStatement.all.mockReturnValue(mixedResults);

      // Act
      const results = sqliteStatement.all();

      // Assert
      expect(results).toEqual(mixedResults);
      expect(mockStatement.all).toHaveBeenCalledTimes(1);
    });

    test('should handle the case when the statement throws an error', () => {
      // Arrange
      const errorMessage = 'Database error';
      mockStatement.all.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      // Act & Assert
      expect(() => sqliteStatement.all()).toThrowError(errorMessage);
      expect(mockStatement.all).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: all
