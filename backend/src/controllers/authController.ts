import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/Usuarios';
import { Request, Response } from 'express';

const JWT_SECRET = "F4T0DhrBz3cYh0C9w1jJkq5r7eN8Lm2oQxv9k6U1rH8Zp3G7sV0tOaK4lN5F6Wz";

export const register = async (req: Request, res: Response) => {
  const { nome, email, senha, papel } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);

    const novoUsuario = await User.create({
      nome,
      email,
      senha: hashedPassword,
      papel
    });

    const token = jwt.sign(
      { id: novoUsuario.id, email: novoUsuario.email, papel: novoUsuario.papel },
      JWT_SECRET,
      { expiresIn: '1h' }
    );


    res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      papel: novoUsuario.papel,
      token
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ msg: 'Erro ao registrar usuário', error: error.message });
    } else {
      res.status(500).json({ msg: 'Erro desconhecido ao registrar usuário' });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const usuario = await User.findOne({ where: { email } });
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ msg: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, papel: usuario.papel },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      token
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ msg: 'Erro ao autenticar', error: error.message });
    } else {
      res.status(500).json({ msg: 'Erro desconhecido ao autenticar' });
    }
  }
};
