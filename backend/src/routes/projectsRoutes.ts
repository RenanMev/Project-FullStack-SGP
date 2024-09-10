import express from 'express';
import authenticateJWT from '../middlewares/authenticateJWT';
import {
  cadastrarProjeto,
  editarProjeto,
  listarProjetos,
  listarUsuariosEmProjeto,
  removerProjeto,
} from '../controllers/projectsController';

const router = express.Router();

router.get('/', authenticateJWT, listarProjetos);
router.post('/', authenticateJWT, cadastrarProjeto);
router.put('/:id', authenticateJWT, editarProjeto);
router.delete('/:id', authenticateJWT, removerProjeto);
router.get('/:projetoId/usuarios', listarUsuariosEmProjeto);

// router.get('/:projetoId/usuarios', listarUsuariosEmProjeto);
// router.post('/:projetoId/usuarios', authenticateJWT, adicionarUsuarioEmProjeto);
// router.delete('/:projetoId/usuarios/:usuarioId', authenticateJWT, removerUsuarioDeProjeto);

export default router;
