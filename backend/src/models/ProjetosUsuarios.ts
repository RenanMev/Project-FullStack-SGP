import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';
import Projeto from './Projeto'; 
import User from './Usuarios'; 

interface ProjetosUsuariosAttributes {
  projeto_id: number;
  usuario_id: number;
}

interface ProjetosUsuariosCreationAttributes extends Optional<ProjetosUsuariosAttributes, 'projeto_id' | 'usuario_id'> {}

class ProjetosUsuarios extends Model<ProjetosUsuariosAttributes, ProjetosUsuariosCreationAttributes> implements ProjetosUsuariosAttributes {
  public projeto_id!: number;
  public usuario_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProjetosUsuarios.init(
  {
    projeto_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Projeto,
        key: 'id',
      },
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
      primaryKey: true,
    }
  },
  {
    sequelize,
    modelName: 'ProjetosUsuarios',
    tableName: 'Projetos_Usuarios',
    timestamps: false,
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

export default ProjetosUsuarios;
