import User from '../models/Usuarios';
import { Request, Response } from 'express';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const usuarios = await User.findAll();
    res.json(usuarios);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ msg: 'Erro ao listar usuários', error: error.message });
    } else {
      res.status(500).json({ msg: 'Erro desconhecido ao listar usuários' });
    }
  }
};



export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    const user = await User.findByPk(userId);

    if (user) {
      res.json({
        id: user.id,
        nome: user.nome,
        email: user.email,
        papel: user.papel
      });
    } else {
      res.status(404).json({ msg: 'Usuário não encontrado' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ msg: 'Erro ao buscar usuário', error: error.message });
    } else {
      res.status(500).json({ msg: 'Erro desconhecido ao buscar usuário' });
    }
  }
};

