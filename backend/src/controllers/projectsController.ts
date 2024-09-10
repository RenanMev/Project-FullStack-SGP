import { Request, Response } from 'express';
import Projeto from '../models/Projects';
import User from '../models/User'; 
import ProjetoUsuario from '../models/ProjetosUsuarios';
import ProjetosUsuarios from '../models/ProjetosUsuarios';

export const listarProjetos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const projetos = await Projeto.findAll();
    if (projetos.length === 0) {
      return res.status(404).json({ error: 'Nenhum projeto encontrado.' });
    }
    return res.status(200).json(projetos);
  } catch (error) {
    console.error('Erro ao listar projetos:', error);
    return res.status(500).json({ error: 'Erro ao listar projetos.' });
  }
};

export const cadastrarProjeto = async (req: Request, res: Response): Promise<Response> => {
  const { nome, descricao, data_inicio, data_fim, status } = req.body;

  try {
    if (!nome || !data_inicio || !status) {
      return res.status(400).json({ error: 'Nome, data_inicio e status são obrigatórios.' });
    }

    const novoProjeto = await Projeto.create({ 
      nome, 
      descricao, 
      data_inicio, 
      status, 
      data_fim 
    });
    
    return res.status(201).json(novoProjeto);
  } catch (error) {
    console.error('Erro ao cadastrar projeto:', error);
    return res.status(400).json({ error: 'Erro ao cadastrar projeto.', msg: (error as Error).message });
  }
};

export const editarProjeto = async (req: Request, res: Response): Promise<Response> => {
  const id = parseInt(req.params.id, 10);
  const { nome, descricao, data_inicio, data_fim, status } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  try {
    const projeto = await Projeto.findByPk(id);
    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }

    if (!nome || !data_inicio || !status) {
      return res.status(400).json({ error: 'Nome, data_inicio e status são obrigatórios.' });
    }

    projeto.nome = nome;
    projeto.descricao = descricao;
    projeto.data_inicio = data_inicio;
    projeto.data_fim = data_fim;
    projeto.status = status;

    await projeto.save();

    return res.status(200).json(projeto);
  } catch (error) {
    console.error('Erro ao editar projeto:', error);
    return res.status(400).json({ error: 'Erro ao editar projeto.', msg: (error as Error).message });
  }
};

export const removerProjeto = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const projeto = await Projeto.findByPk(id);
    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }

    await projeto.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao remover projeto:', error);
    return res.status(400).json({ error: 'Erro ao remover projeto.', msg: (error as Error).message });
  }
};

export const listarUsuariosEmProjeto = async (req: Request, res: Response): Promise<Response> => {
  const { projetoId } = req.params;

  try {
    console.log(`Buscando projeto com ID: ${projetoId}`);
    const projeto = await Projeto.findByPk(projetoId, {
      include: {
        model: User,
        through: { attributes: [] },
        as: 'Usuarios' // Certifique-se de que o alias é 'Usuarios'
      }
    });

    if (!projeto) {
      console.log(`Nenhum projeto encontrado com o ID: ${projetoId}`);
      return res.status(404).json({ mensagem: 'Nenhum projeto encontrado com o ID especificado.' });
    }

    console.log(`Projeto encontrado: ${JSON.stringify(projeto)}`);

    const usuarios = (projeto.Usuarios || []).map(user => ({
      id: user.dataValues.id,
      nome: user.dataValues.nome,
      email: user.dataValues.email,
      papel: user.dataValues.papel
    }));
    

    return res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar usuários.' });
  }
};





