import express from 'express';
import { json, urlencoded } from 'body-parser';
import todoRoutes from './routes/todoRoutes';
import commentRoutes from './routes/commentRoutes'; // Import the new comment routes
import { validateTodo } from './middleware/errorHandler';

const createApp = (): express.Application => {
  const app = express();

  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.use('/api/todos', todoRoutes);
  app.use('/api', commentRoutes); // Use the new comment routes

  app.use(validateTodo);

  return app;
};

export default createApp;