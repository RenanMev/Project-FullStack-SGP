import User from '../models/User';
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
