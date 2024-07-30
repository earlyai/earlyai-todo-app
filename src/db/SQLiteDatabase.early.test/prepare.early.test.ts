
// Unit tests for: prepare

import { Database as SQLiteDatabaseType } from 'better-sqlite3';

import { SQLiteDatabase, SQLiteStatement } from '../SQLiteDatabase';


jest.mock("better-sqlite3", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      prepare: jest.fn(),
      exec: jest.fn(),
    })),
  };
});

describe('SQLiteDatabase.prepare() prepare method', () => {
  let mockDb: jest.Mocked<SQLiteDatabaseType>;

  beforeEach(() => {
    const Database = require('better-sqlite3').default;
    mockDb = new Database() as jest.Mocked<SQLiteDatabaseType>;
  });

  describe('Happy Path', () => {
  });

  describe('Edge Cases', () => {
    test('should throw an error if SQL is invalid', () => {
      // Arrange
      const sql = 'INVALID SQL';
      mockDb.prepare.mockImplementation(() => {
        throw new Error('SQL error');
      });
      const db = new SQLiteDatabase(mockDb);

      // Act & Assert
      expect(() => db.prepare(sql)).toThrow('SQL error');
    });
  });
});

// End of unit tests for: prepare
