import express from 'express';
import { addFileProjects } from '../controllers/addFileProjects';

const router = express.Router();

router.post('/projectfile', addFileProjects);

export default router;
