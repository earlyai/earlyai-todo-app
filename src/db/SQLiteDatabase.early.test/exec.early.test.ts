
// Unit tests for: exec

import { Database as SQLiteDatabaseType } from 'better-sqlite3';

import { SQLiteDatabase } from '../SQLiteDatabase';


jest.mock("better-sqlite3", () => {
  return jest.fn().mockImplementation(() => {
    return {
      exec: jest.fn(),
    };
  });
});

describe('SQLiteDatabase.exec() exec method', () => {
  let dbMock: jest.Mocked<SQLiteDatabaseType>;
  let sqliteDatabase: SQLiteDatabase;

  beforeEach(() => {
    dbMock = new (require('better-sqlite3'))() as jest.Mocked<SQLiteDatabaseType>;
    sqliteDatabase = new SQLiteDatabase(dbMock);
  });

  describe('Happy Path', () => {
    test('should execute a valid SQL command without errors', () => {
      // Arrange
      const sql = 'CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)';
      
      // Act
      sqliteDatabase.exec(sql);
      
      // Assert
      expect(dbMock.exec).toHaveBeenCalledWith(sql);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty SQL string gracefully', () => {
      // Arrange
      const sql = '';
      
      // Act
      sqliteDatabase.exec(sql);
      
      // Assert
      expect(dbMock.exec).toHaveBeenCalledWith(sql);
    });

    test('should throw an error for invalid SQL command', () => {
      // Arrange
      const sql = 'INVALID SQL COMMAND';
      dbMock.exec.mockImplementation(() => {
        throw new Error('SQLITE_ERROR: near "INVALID": syntax error');
      });
      
      // Act & Assert
      expect(() => sqliteDatabase.exec(sql)).toThrow('SQLITE_ERROR: near "INVALID": syntax error');
    });

    test('should handle SQL command with special characters', () => {
      // Arrange
      const sql = 'CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT, description TEXT DEFAULT "Special chars: !@#$%^&*()")';
      
      // Act
      sqliteDatabase.exec(sql);
      
      // Assert
      expect(dbMock.exec).toHaveBeenCalledWith(sql);
    });

    test('should handle SQL command with large input', () => {
      // Arrange
      const largeSQL = 'INSERT INTO test (name) VALUES ' + Array(1000).fill('(?)').join(',');
      
      // Act
      sqliteDatabase.exec(largeSQL);
      
      // Assert
      expect(dbMock.exec).toHaveBeenCalledWith(largeSQL);
    });
  });
});

// End of unit tests for: exec
