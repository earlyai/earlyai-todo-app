
// Unit tests for: exec


import { IDatabase, SQLiteDatabase } from './SQLiteDatabase';


interface MockSQLiteDatabaseType {
  exec: jest.Mock;
}

class MockSQLiteDatabase implements MockSQLiteDatabaseType {
  public exec = jest.fn();
}

describe('SQLiteDatabase.exec() exec method', () => {
  let mockDb: MockSQLiteDatabase;
  let sqliteDatabase: IDatabase;

  beforeEach(() => {
    mockDb = new MockSQLiteDatabase();
    sqliteDatabase = new SQLiteDatabase(mockDb as any);
  });

  describe('Happy path', () => {
    test('should execute SQL without errors', () => {
      // Arrange
      const sql = 'CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)';
      (mockDb.exec as unknown as jest.Mock).mockReturnValue(undefined);

      // Act
      sqliteDatabase.exec(sql);

      // Assert
      expect(mockDb.exec).toHaveBeenCalledWith(sql);
    });
  });

  describe('Edge cases', () => {
    test('should handle empty SQL string', () => {
      // Arrange
      const sql = '';
      (mockDb.exec as unknown as jest.Mock).mockReturnValue(undefined);

      // Act
      sqliteDatabase.exec(sql);

      // Assert
      expect(mockDb.exec).toHaveBeenCalledWith(sql);
    });

    test('should handle SQL with special characters', () => {
      // Arrange
      const sql = 'CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT, description TEXT DEFAULT "Special \'Chars\'")';
      (mockDb.exec as unknown as jest.Mock).mockReturnValue(undefined);

      // Act
      sqliteDatabase.exec(sql);

      // Assert
      expect(mockDb.exec).toHaveBeenCalledWith(sql);
    });

    test('should throw an error for invalid SQL', () => {
      // Arrange
      const sql = 'INVALID SQL';
      const error = new Error('SQLITE_ERROR: near "INVALID": syntax error');
      (mockDb.exec as unknown as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      expect(() => sqliteDatabase.exec(sql)).toThrow(error);
      expect(mockDb.exec).toHaveBeenCalledWith(sql);
    });

    test('should handle SQL with large input', () => {
      // Arrange
      const sql = 'CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT, description TEXT)';
      const largeInput = 'a'.repeat(1000000); // 1 million characters
      (mockDb.exec as unknown as jest.Mock).mockReturnValue(undefined);

      // Act
      sqliteDatabase.exec(sql + largeInput);

      // Assert
      expect(mockDb.exec).toHaveBeenCalledWith(sql + largeInput);
    });
  });
});

// End of unit tests for: exec
