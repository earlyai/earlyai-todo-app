import { Router } from 'express';
import { getComments, addComment, deleteComment } from '../controllers/commentController';
import { SQLiteDatabase } from '../db/SQLiteDatabase';
import { CommentService } from '../services/commentService';

const router = Router();
const db = new SQLiteDatabase('path/to/database/file'); // Adjust the path to your database file
const commentService = new CommentService(db);

// Route to get all comments for a todo
router.get('/:todoId/comments', getComments(commentService));

// Route to add a comment to a todo
router.post('/:todoId/comments', addComment(commentService));

// Route to delete a comment
router.delete('/comments/:id', deleteComment(commentService));

export default router;