import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';
import { MediaInstance } from './media-model';

export interface PostInstance extends Model {
    id: number;
    title: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    UserId: number;
    Media: MediaInstance[];
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