import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';

interface UserAttributes {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  papel: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public nome!: string;
  public email!: string;
  public senha!: string;
  public papel!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
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

export default User;
