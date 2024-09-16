import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';
import Usuarios from './Usuarios';

interface ProjectAttributes {
  id: number;
  nome: string;
  descricao?: string;
  data_inicio: Date;
  data_fim?: Date | null;
  status: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id'> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public nome!: string;
  public descricao?: string;
  public data_inicio!: Date;
  public data_fim?: Date;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly Usuarios?: Usuarios[];
}

Project.init(
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
    modelName: 'Project',
    tableName: 'projetos',
    timestamps: false, 
  }
);

export default Project;
