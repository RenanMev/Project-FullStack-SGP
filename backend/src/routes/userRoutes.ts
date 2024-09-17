import express from 'express';
import authenticateJWT from '../middlewares/authenticateJWT';
import { editUser, getAllUsers, getUser } from '../controllers/userController';
import { register, login } from '../controllers/authController';
import { editProjects } from '../controllers/projectsController';

const router = express.Router();

router.get('/usuarios', authenticateJWT, getAllUsers);

router.get('/usuarios/:userId', authenticateJWT, getUser);

router.put('/editUser/:userId', authenticateJWT, editUser);

export default router;
