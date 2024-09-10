import express from 'express';
import authenticateJWT from '../middlewares/authenticateJWT';
import { register, login } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);


export default router;
