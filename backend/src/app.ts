import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import userRoutes from './routes/userRoutes';
import projetoRoutes from './routes/projectsRoutes';
import sequelize from './config/db.config';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/projetos', projetoRoutes);

export default app;
