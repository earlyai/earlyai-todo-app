
// Unit tests for: get


import { IStatement, SQLiteStatement } from './SQLiteDatabase';


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
      const expectedRow = { id: 1, name: 'Test' };
      (mockStatement.get as unknown as jest.Mock).mockReturnValue(expectedRow);

      // Act
      const result = sqliteStatement.get(1);

      // Assert
      expect(result).toEqual(expectedRow);
      expect(mockStatement.get).toHaveBeenCalledWith(1);
    });

    test('should return undefined when no row matches the parameters', () => {
      // Arrange
      (mockStatement.get as unknown as jest.Mock).mockReturnValue(undefined);

      // Act
      const result = sqliteStatement.get(999);

      // Assert
      expect(result).toBeUndefined();
      expect(mockStatement.get).toHaveBeenCalledWith(999);
    });
  });

  describe('Edge Cases', () => {
    test('should handle no parameters gracefully', () => {
      // Arrange
      const expectedRow = { id: 1, name: 'Test' };
      (mockStatement.get as unknown as jest.Mock).mockReturnValue(expectedRow);

      // Act
      const result = sqliteStatement.get();

      // Assert
      expect(result).toEqual(expectedRow);
      expect(mockStatement.get).toHaveBeenCalledWith();
    });

    test('should handle null parameters gracefully', () => {
      // Arrange
      const expectedRow = { id: 1, name: 'Test' };
      (mockStatement.get as unknown as jest.Mock).mockReturnValue(expectedRow);

      // Act
      const result = sqliteStatement.get(null);

      // Assert
      expect(result).toEqual(expectedRow);
      expect(mockStatement.get).toHaveBeenCalledWith(null);
    });

    test('should handle multiple parameters gracefully', () => {
      // Arrange
      const expectedRow = { id: 1, name: 'Test' };
      (mockStatement.get as unknown as jest.Mock).mockReturnValue(expectedRow);

      // Act
      const result = sqliteStatement.get(1, 'Test');

      // Assert
      expect(result).toEqual(expectedRow);
      expect(mockStatement.get).toHaveBeenCalledWith(1, 'Test');
    });

    test('should handle empty result set gracefully', () => {
      // Arrange
      (mockStatement.get as unknown as jest.Mock).mockReturnValue(undefined);

      // Act
      const result = sqliteStatement.get();

      // Assert
      expect(result).toBeUndefined();
      expect(mockStatement.get).toHaveBeenCalledWith();
    });

    test('should handle SQL errors gracefully', () => {
      // Arrange
      const errorMessage = 'SQL error';
      (mockStatement.get as unknown as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      // Act & Assert
      expect(() => sqliteStatement.get(1)).toThrow(errorMessage);
      expect(mockStatement.get).toHaveBeenCalledWith(1);
    });
  });
});

// End of unit tests for: get
