import User, { UserInstance } from '../models/user-model';
import bcrypt from 'bcrypt';
import tokenService from './token-service';
import UserDto from '../dtos/user-dto';
import { ApiError } from '../exceptions/api-error';

class UserService {
  private User;

  constructor() {
    this.User = User;
  }

  async registration(email: string, password: string) {

    const existingUser = await this.User.findOne({ where: { email } });
    if (existingUser) {
      throw ApiError.BadRequest('Пользователь с таким Email уже существует');
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const user = await this.User.create({ email, password: hashPassword });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
    return {...tokens, user: userDto};
  }

  async login(email: string, password: string) {
    const user = await this.User.findOne({where: {email}})
    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким Email не найден');
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals){
      throw ApiError.BadRequest('Неверный пароль')
    }
    
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
    return {...tokens, user: userDto};
  }

  async logout(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string) {
    if(!refreshToken) {
      throw ApiError.UnauhorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken) as UserDto;
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if(!userData || !tokenFromDb) {
      throw ApiError.UnauhorizedError();
    }

    const user = await this.User.findOne({where: {id: userData.id}})
    if(!user){
      throw ApiError.UnauhorizedError();
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
    return {...tokens, user: userDto};
  }

  async getAllUsers() {
    const users = await this.User.findAll();
    return users;
  }
}

export default new UserService();