import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

export interface UserInstance extends Model {
    id: number;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }

const User = sequelize.define<UserInstance>('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default User;