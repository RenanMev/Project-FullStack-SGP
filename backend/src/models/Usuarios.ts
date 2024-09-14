import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';

interface UsuariosAttributes {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  papel: string;
}

interface UsuariosCreationAttributes extends Optional<UsuariosAttributes, 'id'> {}

class Usuarios extends Model<UsuariosAttributes, UsuariosCreationAttributes> implements UsuariosAttributes {
  public id!: number;
  public nome!: string;
  public email!: string;
  public senha!: string;
  public papel!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Usuarios.init({
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  papel: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'Usuarios',
  timestamps: false,
});

export default Usuarios;
