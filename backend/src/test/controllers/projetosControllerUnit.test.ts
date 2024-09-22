import { Request, Response } from 'express';
import * as projetoController from '../../controllers/projectsController';
import Projeto from '../../models/Projeto';
import Usuarios from '../../models/Usuarios';
import ProjetosUsuarios from '../../models/ProjetosUsuarios';
import sequelize from '../../config/db.config';

jest.mock('../../models/Projeto');
jest.mock('../../models/Usuarios');
jest.mock('../../models/ProjetosUsuarios');

describe('Projeto Controller', () => {
  afterAll(async () => {
    await sequelize.close();
  });
  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockRequest = (params = {}, body = {}) => ({
    params,
    body,
  } as Request);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ListAllProjects', () => {
    afterAll(async () => {
      await sequelize.close();
    });
    it('deve retornar 200 e a lista de projetos', async () => {
      const projetos = [{ id: 1, nome: 'Projeto 1' }];
      Projeto.findAll = jest.fn().mockResolvedValue(projetos);

      const req = mockRequest();
      const res = mockResponse();

      await projetoController.ListAllProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(projetos);
    });

    it('deve retornar 404 se nenhum projeto for encontrado', async () => {
      Projeto.findAll = jest.fn().mockResolvedValue([]);

      const req = mockRequest();
      const res = mockResponse();

      await projetoController.ListAllProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nenhum projeto encontrado.' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      Projeto.findAll = jest.fn().mockRejectedValue(new Error('Erro'));

      const req = mockRequest();
      const res = mockResponse();

      await projetoController.ListAllProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao listar projetos.' });
    });
  });

  describe('getProjects', () => {
    afterAll(async () => {
      await sequelize.close();
    });
    it('deve retornar 200 ao buscar um projeto existente', async () => {
      const projeto = { id: 1, nome: 'Projeto 1' };
      Projeto.findByPk = jest.fn().mockResolvedValue(projeto);

      const req = mockRequest({ id: '1' });
      const res = mockResponse();

      await projetoController.getProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(projeto);
    });

    it('deve retornar 404 se o projeto não for encontrado', async () => {
      Projeto.findByPk = jest.fn().mockResolvedValue(null);

      const req = mockRequest({ id: '9999' });
      const res = mockResponse();

      await projetoController.getProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Projeto não encontrado.' });
    });
  });

  describe('registerProjects', () => {
    afterAll(async () => {
      await sequelize.close();
    });
    it('deve cadastrar um novo projeto', async () => {
      const novoProjeto = { id: 1, nome: 'Novo Projeto' };
      Projeto.create = jest.fn().mockResolvedValue(novoProjeto);

      const req = mockRequest({}, { nome: 'Novo Projeto', data_inicio: '2023-01-01', status: 'pendente' });
      const res = mockResponse();

      await projetoController.registerProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(novoProjeto);
    });

    it('deve retornar 400 se dados obrigatórios estiverem faltando', async () => {
      const req = mockRequest({}, { descricao: 'Descrição do Projeto' });
      const res = mockResponse();

      await projetoController.registerProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nome, data_inicio e status são obrigatórios.' });
    });
  });

  describe('editProjects', () => {
    afterAll(async () => {
      await sequelize.close();
    });
    it('deve editar um projeto existente', async () => {
      const projeto = { id: 1, nome: 'Projeto Antigo', save: jest.fn() };
      Projeto.findByPk = jest.fn().mockResolvedValue(projeto);

      const req = mockRequest({ id: '1' }, { nome: 'Projeto Editado', data_inicio: '2023-01-01', status: 'Concluído', prioridade: 'Alta' });
      const res = mockResponse();

      await projetoController.editProjects(req, res);

      expect(projeto.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(projeto);
    });

    it('deve retornar 404 se o projeto não for encontrado', async () => {
      Projeto.findByPk = jest.fn().mockResolvedValue(null);

      const req = mockRequest({ id: '9999' }, {});
      const res = mockResponse();

      await projetoController.editProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Projeto não encontrado.' });
    });

    it('deve retornar 400 se dados obrigatórios estiverem faltando', async () => {
      const req = mockRequest({ id: '1' }, { prioridade: 'Alta' });
      const res = mockResponse();

      await projetoController.editProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nome, data_inicio e status são obrigatórios.' });
    });
  });

  describe('deleteProjects', () => {
    afterAll(async () => {
      await sequelize.close();
    });
    it('deve remover um projeto existente', async () => {
      const projeto = { id: 1, destroy: jest.fn() };
      Projeto.findByPk = jest.fn().mockResolvedValue(projeto);

      const req = mockRequest({ id: '1' });
      const res = mockResponse();

      await projetoController.deleteProjects(req, res);

      expect(projeto.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('deve retornar 404 se o projeto não for encontrado', async () => {
      Projeto.findByPk = jest.fn().mockResolvedValue(null);

      const req = mockRequest({ id: '9999' });
      const res = mockResponse();

      await projetoController.deleteProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Projeto não encontrado.' });
    });
  });
});
