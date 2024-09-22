import request from 'supertest';
import app from '../../app';
import sequelize from '../../config/db.config';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImVtYWlsIjoicmVuYW5kem5mYW1AZ21haWwuY29tIiwicGFwZWwiOiJHZXJlbnRlIiwiaWF0IjoxNzI3MDQwNzUxLCJleHAiOjE3MjcwNDQzNTF9.UVT8T9tk9uhMItPDQ90NHVmhsd54IET_U-yPJsiuD9w';

describe('Project Controller Tests', () => {
  afterAll(async () => {
    await sequelize.close();
  });

  beforeAll(async () => {
    await sequelize.authenticate();
  });

  describe('ListAllProjects', () => {
    it('deve retornar 200 ao listar todos os projetos', async () => {
      const res = await request(app)
        .get('/api/projetos')
        .set('Authorization', `${token}`);

      expect(res.status).toBe(200);
    });

    it('deve retornar 404 se nenhum projeto for encontrado', async () => {
      const res = await request(app)
        .get('/api/projetos')
        .set('Authorization', `${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Nenhum projeto encontrado.' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      const res = await request(app)
        .get('/api/projetos')
        .set('Authorization', `${token}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Erro ao listar projetos.' });
    });
  });

  describe('GetProject', () => {
    it('deve retornar 200 ao buscar um projeto existente', async () => {
      const res = await request(app)
        .get('/api/projetos/12')
        .set('Authorization', `${token}`);

      expect(res.status).toBe(200);
    });

    it('deve retornar 404 se o projeto não for encontrado', async () => {
      const res = await request(app)
        .get('/api/projetos/9999')
        .set('Authorization', `${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Projeto não encontrado.' });
    });
  });

  describe('RegisterProject', () => {
    it('deve cadastrar um novo projeto', async () => {
      const res = await request(app)
        .post('/api/projetos')
        .set('Authorization', `${token}`)
        .send({ nome: 'Novo Projeto', data_inicio: '2023-01-01', status: 'pendente', descricao: 'teste jest' });

      expect(res.status).toBe(201);
      expect(res.body.nome).toBe('Novo Projeto');
    });

    it('deve retornar 400 se dados obrigatórios estiverem faltando', async () => {
      const res = await request(app)
        .post('/api/projetos')
        .set('Authorization', `${token}`)
        .send({ descricao: 'Descrição do Projeto' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Nome, data_inicio e status são obrigatórios.' });
    });
  });

  describe('EditProject', () => {
    it('deve editar um projeto existente', async () => {
      const res = await request(app)
        .put('/api/projetos/4')
        .set('Authorization', `${token}`)
        .send({
          nome: 'Projeto Editado',
          data_inicio: '2023-01-01',
          status: 'Concluído',
          prioridade: 'Alta'
        });

      expect(res.status).toBe(200);
      expect(res.body.nome).toBe('Projeto Editado');
    });
  });
  
  describe('DeleteProject', () => {
    it('deve remover um projeto existente', async () => {
      const res = await request(app)
        .delete('/api/projetos/6')
        .set('Authorization', `${token}`);

      expect(res.status).toBe(204);
    });

    it('deve retornar 404 se o projeto não for encontrado para remoção', async () => {
      const res = await request(app)
        .delete('/api/projetos/1')
        .set('Authorization', `${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Projeto não encontrado.' });
    });
  });

});
