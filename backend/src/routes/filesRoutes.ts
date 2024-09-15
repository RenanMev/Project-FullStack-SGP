import express from 'express';
import { addFileProjects } from '../controllers/addFileProjects';

const routerFlie = express.Router();

routerFlie.post('/projectfile', addFileProjects)

export default routerFlie;