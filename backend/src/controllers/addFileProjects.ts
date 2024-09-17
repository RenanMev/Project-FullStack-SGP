import { Request, Response } from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';
import Projeto from '../models/Projeto';

interface ProjetoCSV {
  id: string;
  nome: string;
  descricao?: string;
  data_inicio: string;
  data_fim?: string;
  status: string;
}

const storage = multer.memoryStorage();

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

const uploadMiddleware = upload.single('file');

export const addFileProjects = (req: Request, res: Response): void => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error('Erro ao fazer upload do arquivo:', err);
      return res.status(400).json({ error: 'Erro ao fazer upload do arquivo.', message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const results: Partial<Projeto>[] = [];
    const bufferStream = Readable.from(req.file.buffer);

    bufferStream
      .pipe(csv({ separator: ';' }))
      .on('data', (data: ProjetoCSV) => {
        console.log('Dados do CSV:', data);

        try {
          const id = parseInt(data.id.trim(), 10);
          const nome = data.nome.trim();
          const descricao = data.descricao ? data.descricao.trim() : undefined;
          const data_inicio = data.data_inicio.trim();
          const data_fim = data.data_fim ? data.data_fim.trim() : undefined;
          const status = data.status.trim() || undefined;

          const parseDate = (dateString: string) => {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? undefined : date;
          };

          const data_inicio_date = parseDate(data_inicio);
          const data_fim_date = data_fim ? parseDate(data_fim) : undefined;

          if (!isNaN(id) && nome && status) {
            results.push({
              id,
              nome,
              descricao,
              data_inicio: data_inicio_date,
              data_fim: data_fim_date,
              status
            });
          } else {
            console.warn('Dados do projeto inválidos:', data);
          }
        } catch (error) {
          console.error('Erro ao processar dados:', error);
        }
      })
      .on('end', async () => {
        console.log('Processamento concluído. Dados do CSV:', results);

        try {
          for (const project of results) {
            await Projeto.upsert({
              id: project.id as number,  
              nome: project.nome as string,
              descricao: project.descricao as string | undefined,
              data_inicio: project.data_inicio as Date, 
              data_fim: project.data_fim as Date | undefined, 
              status: project.status as string | undefined
            });
          }

          return res.status(200).json({
            message: 'Arquivo processado e projetos atualizados com sucesso!',
            data: results
          });
        } catch (error) {
          console.error('Erro ao salvar os dados na tabela Projetos:', error);
          return res.status(500).json({ error: 'Erro ao salvar os dados na tabela Projetos.' });
        }
      })
      .on('error', (error) => {
        console.error('Erro ao processar o arquivo CSV:', error);
        return res.status(500).json({ error: 'Erro ao processar o arquivo CSV.' });
      });
  });
};
