import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';
import User from './User';
import ProjetosUsuarios from './ProjetosUsuarios';

interface ProjetoAttributes {
  id: number;
  nome: string;
  descricao?: string;
  data_inicio: Date;
  data_fim?: Date;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjetoCreationAttributes extends Optional<ProjetoAttributes, 'id'> { }

class Projeto extends Model<ProjetoAttributes, ProjetoCreationAttributes> implements ProjetoAttributes {
  public id!: number;
  public nome!: string;
  public descricao?: string;
  public data_inicio!: Date;
  public data_fim?: Date;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly Usuarios?: User[]; 
}

Projeto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data_fim: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Projeto',
    tableName: 'Projetos',
    timestamps: true,
  }
);

Projeto.belongsToMany(User, {
  through: ProjetosUsuarios,
  as: 'Usuarios',
  foreignKey: 'projeto_id', 
  otherKey: 'usuario_id',
});

User.belongsToMany(Projeto, {
  through: ProjetosUsuarios,
  as: 'Projetos',
  foreignKey: 'usuario_id',
  otherKey: 'projeto_id',
});

export default Projeto;
