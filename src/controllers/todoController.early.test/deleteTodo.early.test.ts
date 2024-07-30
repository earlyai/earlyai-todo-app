
// Unit tests for: deleteTodo

import { Request, Response } from 'express';



import { deleteTodo } from '../todoController';


// Mock class for TodoService
class MockTodoService {
  public deleteTodo = jest.fn();
}

describe('deleteTodo() deleteTodo method', () => {
  let mockTodoService: MockTodoService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    mockTodoService = new MockTodoService();
    req = {
      params: { id: '1' }
    } as any;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    } as any;
  });

  describe('Happy Path', () => {
    it('should return 204 status when todo is successfully deleted', () => {
      // Arrange
      mockTodoService.deleteTodo.mockReturnValue(true as any);

      // Act
      deleteTodo(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.deleteTodo).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should return 404 status when todo is not found', () => {
      // Arrange
      mockTodoService.deleteTodo.mockReturnValue(false as any);

      // Act
      deleteTodo(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.deleteTodo).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Todo not found' });
    });

    it('should return 500 status when an exception is thrown', () => {
      // Arrange
      mockTodoService.deleteTodo.mockImplementation(() => {
        throw new Error('Test error');
      });

      // Act
      deleteTodo(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.deleteTodo).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });

    it('should handle missing id parameter gracefully', () => {
      // Arrange
      req.params.id = undefined as any;

      // Act
      deleteTodo(mockTodoService as any)(req, res);

      // Assert
      expect(mockTodoService.deleteTodo).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});

// End of unit tests for: deleteTodo
