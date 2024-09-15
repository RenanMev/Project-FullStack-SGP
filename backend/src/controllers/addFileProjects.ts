import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import Projeto from '../models/Projeto';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  }
});

const uploadMiddleware = upload.single('file'); // Nome do campo deve ser 'file'

export const addFileProjects = (req: Request, res: Response): void => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error('Erro ao fazer upload do arquivo:', err);
      return res.status(400).json({ error: 'Erro ao fazer upload do arquivo.', message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const filePath = path.join('uploads', req.file.filename);
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Validar e transformar dados conforme necessário
        results.push({
          id: data.id,
          nome: data.nome,
          descricao: data.descricao || '',
          data_inicio: data.data_inicio,
          data_fim: data.data_fim || null,
          status: data.status
        });
      })
      .on('end', async () => {
        try {
          for (const project of results) {
            await Projeto.upsert(project);
          }

          fs.unlinkSync(filePath);

          return res.status(200).json({
            message: 'Arquivo enviado e projetos atualizados com sucesso!',
            data: results
          });
        } catch (error) {
          console.error('Erro ao processar os dados do CSV:', error);
          return res.status(500).json({ error: 'Erro ao processar os dados do CSV.' });
        }
      })
      .on('error', (error) => {
        console.error('Erro ao processar o arquivo CSV:', error);
        return res.status(500).json({ error: 'Erro ao processar o arquivo CSV.' });
      });
  });
};
