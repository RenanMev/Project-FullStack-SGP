import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import userRoutes from './routes/userRoutes';
import projectRoutes from './routes/projectsRoutes';
import sequelize from './config/db.config';
import router from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', router);
app.use('/api/projetos', projectRoutes);
app.use('/api/user', userRoutes);

export default app;
