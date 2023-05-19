import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

export interface TokenInstance extends Model {
    id: number;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
    UserId: number;
  }

const Token = sequelize.define<TokenInstance>('Token', {
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

export default Token;