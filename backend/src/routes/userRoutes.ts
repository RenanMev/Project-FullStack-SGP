import express from 'express';
import authenticateJWT from '../middlewares/authenticateJWT';
import { getAllUsers, getUser } from '../controllers/userController';
import { register, login } from '../controllers/authController';

const router = express.Router();

router.get('/usuarios', authenticateJWT, getAllUsers);

router.get('/usuarios/:userId', authenticateJWT, getUser);

export default router;
