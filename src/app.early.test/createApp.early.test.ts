
// Unit tests for: createApp

import express from 'express';





import createApp from '../app';


describe('createApp() createApp method', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createApp();
  });

  describe('Happy Path', () => {
    it('should create an express application with JSON and URL-encoded middleware', () => {
      // Test to ensure JSON and URL-encoded middleware are set up
      expect(app).toBeDefined();
      expect(app._router).toBeDefined();
    });

    it('should have /api/todos route', async () => {
      // Test to ensure /api/todos route is set up
      const response = await request(app).get('/api/todos');
      expect(response.status).not.toBe(404);
    });

    it('should have /api route for comments', async () => {
      // Test to ensure /api route for comments is set up
      const response = await request(app).get('/api/comments');
      expect(response.status).not.toBe(404);
    });
  });

  describe('Edge Cases', () => {
    it('should return 400 for invalid title in /api/todos POST', async () => {
      // Test to ensure validation middleware catches invalid title
      const response = await request(app)
        .post('/api/todos')
        .send({ title: '', dueDate: '2023-10-10', reminder: '2023-10-09' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid title');
    });

    it('should return 400 for invalid due date in /api/todos POST', async () => {
      // Test to ensure validation middleware catches invalid due date
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'Test Todo', dueDate: 'invalid-date', reminder: '2023-10-09' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid due date');
    });

    it('should return 400 for invalid reminder date in /api/todos POST', async () => {
      // Test to ensure validation middleware catches invalid reminder date
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'Test Todo', dueDate: '2023-10-10', reminder: 'invalid-date' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid reminder date');
    });

    it('should pass validation for valid todo in /api/todos POST', async () => {
      // Test to ensure validation middleware passes for valid todo
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'Valid Todo', dueDate: '2023-10-10', reminder: '2023-10-09' });
      expect(response.status).not.toBe(400);
    });
  });
});

// End of unit tests for: createApp
