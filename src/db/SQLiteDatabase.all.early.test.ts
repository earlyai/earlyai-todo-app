
// Unit tests for: all


import { SQLiteStatement } from './SQLiteDatabase';


jest.mock('better-sqlite3');

describe('SQLiteStatement.all() all method', () => {
  let mockStatement: any;
  let sqliteStatement: SQLiteStatement;

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
      (mockStatement.all as unknown as jest.Mock).mockReturnValue(expectedResults);

      // Act
      const results = sqliteStatement.all();

      // Assert
      expect(results).toEqual(expectedResults);
      expect(mockStatement.all).toHaveBeenCalledTimes(1);
    });

    test('should return an empty array when there are no results', () => {
      // Arrange
      const expectedResults: any[] = [];
      (mockStatement.all as unknown as jest.Mock).mockReturnValue(expectedResults);

      // Act
      const results = sqliteStatement.all();

      // Assert
      expect(results).toEqual(expectedResults);
      expect(mockStatement.all).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    test('should handle the case where the statement returns undefined', () => {
      // Arrange
      (mockStatement.all as unknown as jest.Mock).mockReturnValue(undefined);

      // Act
      const results = sqliteStatement.all();

      // Assert
      expect(results).toBeUndefined();
      expect(mockStatement.all).toHaveBeenCalledTimes(1);
    });

    test('should handle the case where the statement throws an error', () => {
      // Arrange
      const errorMessage = 'Database error';
      (mockStatement.all as unknown as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      // Act & Assert
      expect(() => sqliteStatement.all()).toThrowError(errorMessage);
      expect(mockStatement.all).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: all
