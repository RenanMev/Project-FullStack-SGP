import { Request, Response } from 'express';
import Projeto from '../models/Projeto';
import ProjetoUsuario from '../models/ProjetosUsuarios';
import ProjetosUsuarios from '../models/ProjetosUsuarios';
import Usuarios from '../models/Usuarios';
import Project from '../models/Projeto';

export const ListAllProjects = async (req: Request, res: Response): Promise<Response> => {
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


export const getProjects = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const projeto = await Projeto.findByPk(id);

    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }

    return res.status(200).json(projeto);
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    return res.status(500).json({ error: 'Erro ao buscar projeto.', msg: (error as Error).message });
  }
};


export const registerProjects = async (req: Request, res: Response): Promise<Response> => {
  const { nome, descricao, data_inicio, data_fim, status, prioridade } = req.body;

  try {
    if (!nome || !data_inicio || !status) {
      return res.status(400).json({ error: 'Nome, data_inicio e status são obrigatórios.' });
    }

    const novoProjeto = await Projeto.create({
      nome,
      descricao,
      data_inicio,
      status,
      data_fim,
      prioridade
    });

    return res.status(201).json(novoProjeto);
  } catch (error) {
    console.error('Erro ao cadastrar projeto:', error);
    return res.status(400).json({ error: 'Erro ao cadastrar projeto.', msg: (error as Error).message });
  }
};

export const editProjects = async (req: Request, res: Response): Promise<Response> => {
  const id = parseInt(req.params.id);
  console.log(id)
  const { nome, descricao, data_inicio, data_fim, status, prioridade } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  if(!prioridade){
    return res.status(400).json({ error: 'Prioridade não foi informado' });
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
    projeto.prioridade = prioridade;

    await projeto.save();

    return res.status(200).json(projeto);
  } catch (error) {
    console.error('Erro ao editar projeto:', error);
    return res.status(400).json({ error: 'Erro ao editar projeto.', msg: (error as Error).message });
  }
};

export const deleteProjects = async (req: Request, res: Response): Promise<Response> => {
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

export const listUserinProjects = async (req: Request, res: Response): Promise<Response> => {
  const { projetoId } = req.params;

  try {
    console.log(`Buscando projeto com ID: ${projetoId}`);
    const projeto = await Projeto.findByPk(projetoId, {
      include: {
        model: Usuarios,
        through: { attributes: [] },
        as: 'Usuarios'
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


export const addUserToProject = async (req: Request, res: Response): Promise<Response> => {

  const projetoId = parseInt(req.params.projetoId);
  const userId = parseInt(req.body.usuario_id);

  try {
    const projeto = await Projeto.findByPk(projetoId);
    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }

    const usuario = await Usuarios.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const jaAdicionado = await ProjetosUsuarios.findOne({
      where: { projeto_id: projetoId, usuario_id: userId },
    });

    if (jaAdicionado) {
      return res.status(400).json({ error: 'Usuário já está adicionado ao projeto.' });
    }

    const novoRegistro = await ProjetosUsuarios.create({ projeto_id: projetoId, usuario_id: userId });

    return res.status(201).json({ mensagem: 'Usuário adicionado ao projeto com sucesso.', novoRegistro });
  } catch (error) {
    console.error('Erro ao adicionar usuário ao projeto:', error);
    return res.status(500).json({ error: 'Erro ao adicionar usuário ao projeto.', msg: (error as Error).message });
  }
};

export const removeUserFromProject = async (req: Request, res: Response): Promise<Response> => {
  const { projetoId, usuarioId } = req.params;

  try {
    const projeto = await Projeto.findByPk(projetoId);
    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado.' });
    }

    const usuario = await Usuarios.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    const projetoUsuario = await ProjetosUsuarios.findOne({
      where: {
        projeto_id: projetoId,
        usuario_id: usuarioId
      }
    });

    if (!projetoUsuario) {
      return res.status(400).json({ erro: 'Usuário não está atribuído ao projeto.' });
    }

    await projetoUsuario.destroy();

    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao remover usuário do projeto:', error);
    return res.status(500).json({ erro: 'Erro ao remover usuário do projeto.' });
  }
};

export const getUserProjects = async (req: Request, res: Response): Promise<Response> => {
  const userId = parseInt(req.params.usuarioId);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'ID de usuário inválido.' });
  }

  try {
    const projetosUsuarios = await ProjetosUsuarios.findAll({
      where: { usuario_id: userId },
      attributes: ['projeto_id']
    });

    if (projetosUsuarios.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum projeto vinculado ao usuário encontrado.' });
    }

    const projetosIds = projetosUsuarios.map(pu => pu.projeto_id);

    const projetos = await Projeto.findAll({
      where: { id: projetosIds }
    });

    return res.status(200).json(projetos);
  } catch (error) {
    console.error('Erro ao buscar projetos do usuário:', error);
    return res.status(500).json({ error: 'Erro ao buscar projetos do usuário.', msg: (error as Error).message });
  }
};


export const updateStatusProjects = async (req: Request, res: Response) => {
  const { projetoId } = req.params;
  console.log
  const { status } = req.body

  try {
    const projeto = await Projeto.findByPk(projetoId);
    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }

    if (!status) {
      return res.status(400).json({ error: 'Status não informado .' });
    }

    projeto.status = status;

    await projeto.save();

    return res.status(200).json(projeto);
  }
  catch (error) {
    console.error('Erro ao atualizar o status do projeto:', error);
    return res.status(500).json({ error: 'Erro ao atualizar o status do projeto.', msg: (error as Error).message });
  }
}

