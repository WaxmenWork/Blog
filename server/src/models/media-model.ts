import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

export interface MediaInstance extends Model {
    id: number;
    type: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
    PostId: number;
   }

   const Media = sequelize.define<MediaInstance>('Media', {
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }
   });

export default Media;