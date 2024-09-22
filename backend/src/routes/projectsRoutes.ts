import express from 'express';
import authenticateJWT from '../middlewares/authenticateJWT';
import {
  addUserToProject,
  deleteProjects,
  editProjects,
  getProjects,
  getUserProjects,
  ListAllProjects,
  listUserinProjects,
  registerProjects,
  removeUserFromProject,
  updateStatusProjects,
} from '../controllers/projectsController';

const router = express.Router();

router.get('/', authenticateJWT, ListAllProjects);
router.post('/', authenticateJWT, registerProjects);
router.put('/:id', authenticateJWT, editProjects);
router.get('/:id', authenticateJWT, getProjects);
router.delete('/:id', authenticateJWT, deleteProjects);
router.get('/:projetoId/usuarios', authenticateJWT, listUserinProjects);
router.post('/:projetoId/usuarios', authenticateJWT, addUserToProject);
router.delete('/:projetoId/usuarios/:usuarioId', authenticateJWT, removeUserFromProject);
router.get('/:usuarioId/projetos', authenticateJWT, getUserProjects);
router.put('/status/:projetoId', authenticateJWT, updateStatusProjects)

export default router;
