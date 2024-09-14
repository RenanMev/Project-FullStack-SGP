import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'dW5#Tz8r3L!9Qz1V',
  database: 'fullstacklab',
  dialect: 'mysql',
});


sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados foi bem-sucedida.');
  })
  .catch((error) => {
    console.error('Não foi possível conectar ao banco de dados:', error);
  });

export default sequelize;
