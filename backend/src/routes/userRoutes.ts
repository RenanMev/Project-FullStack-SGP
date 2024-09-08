import express from 'express';
import authenticateJWT from '../middlewares/authenticateJWT';
import { getAllUsers } from '../controllers/userController';

const router = express.Router();

router.get('/users', authenticateJWT, getAllUsers);

export default router;
