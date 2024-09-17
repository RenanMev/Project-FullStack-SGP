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

export const editUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const { nome, email, papel } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    user.nome = nome || user.nome;
    user.email = email || user.email;
    user.papel = papel || user.papel;

    await user.save();

    res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      papel: user.papel
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ msg: 'Erro ao editar usuário', error: error.message });
    } else {
      res.status(500).json({ msg: 'Erro desconhecido ao editar usuário' });
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
