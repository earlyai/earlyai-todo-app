import { Router } from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo, getFormattedTodos } from '../controllers/todoController';
import { SQLiteDatabase } from '../db/SQLiteDatabase';
import { TodoService } from '../services/todoService';

const router = Router();
const db = new SQLiteDatabase('path/to/database/file'); // Adjust the path to your database file
const todoService = new TodoService(db);

// Route to get all todos, with optional query parameters for sorting and filtering
router.get('/', getTodos(todoService));

// Route to create a new todo
router.post('/', createTodo(todoService));

// Route to update an existing todo
router.put('/:id', updateTodo(todoService));

// Route to delete a todo
router.delete('/:id', deleteTodo(todoService));

// Route to get formatted todos
router.get('/formatted', getFormattedTodos(todoService));

export default router;