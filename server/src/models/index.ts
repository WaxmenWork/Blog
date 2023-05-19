import User from './user-model';
import Token from './token-model';
import Post from './post-model';
import Media from './media-model';

export const associateModels = () => {
  User.hasOne(Token);
  Token.belongsTo(User);

  User.hasMany(Post);
  Post.belongsTo(User);

  Post.hasMany(Media);
  Media.belongsTo(Post);
};

export const syncDatabase = async () => {
  await User.sync();
  await Token.sync();
  await Post.sync();
  await Media.sync();
};