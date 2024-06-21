
// Unit tests for: deleteTodo

import { Request, Response } from 'express';



import { deleteTodo } from './todoController';

// MockTodoService.ts

// deleteTodo.test.ts

// MockTodoService.ts

export class MockTodoService {
  public deleteTodo = jest.fn();
}

// deleteTodo.test.ts
describe('deleteTodo() deleteTodo method', () => {
  let mockTodoService: MockTodoService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    mockTodoService = new MockTodoService();
    req = {
      params: {
        id: '1',
      },
    } as any;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    } as any;
  });

  describe('Happy Path', () => {
    it('should delete a todo and return 204 status code', () => {
      // Arrange
      (mockTodoService.deleteTodo as unknown as jest.Mock).mockReturnValue(true);

      // Act
      deleteTodo(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.deleteTodo).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should return 404 if the todo is not found', () => {
      // Arrange
      (mockTodoService.deleteTodo as unknown as jest.Mock).mockReturnValue(false);

      // Act
      deleteTodo(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.deleteTodo).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Todo not found' });
    });

    it('should return 500 if there is an internal server error', () => {
      // Arrange
      (mockTodoService.deleteTodo as unknown as jest.Mock).mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      // Act
      deleteTodo(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.deleteTodo).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});

// End of unit tests for: deleteTodo
