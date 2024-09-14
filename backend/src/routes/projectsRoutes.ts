import express from 'express';
import authenticateJWT from '../middlewares/authenticateJWT';
import {
  addUserToProject,
  deleteProjects,
  editProjects,
  ListAllProjects,
  listUserinProjects,
  registerProjects,
  removeUserFromProject,
} from '../controllers/projectsController';

const router = express.Router();

router.get('/', authenticateJWT, ListAllProjects);
router.post('/', authenticateJWT, registerProjects);
router.put('/:id', authenticateJWT, editProjects);
router.delete('/:id', authenticateJWT, deleteProjects);
router.get('/:projetoId/usuarios', authenticateJWT, listUserinProjects);
router.post('/:projetoId/usuarios', authenticateJWT, addUserToProject);
router.delete('/:projetoId/usuarios/:usuarioId', authenticateJWT, removeUserFromProject);

export default router;
