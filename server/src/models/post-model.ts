import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

export interface PostInstance extends Model {
    id: number;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    UserId: number;
  }

const Post = sequelize.define<PostInstance>('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  }
});

export default Post;