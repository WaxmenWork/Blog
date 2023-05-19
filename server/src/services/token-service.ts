import jwt from 'jsonwebtoken';
import Token from '../models/token-model';
import UserDto from '../dtos/user-dto';

class TokenService {

    private Token;

    constructor() {
        this.Token = Token;
    }

    generateTokens(payload: UserDto) {

        if (!process.env.JWT_ACCESS_KEY || !process.env.JWT_REFRESH_KEY) {
            throw new Error('JWT keys are missing!');
        }

        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn: '30d'});

        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token: string) {
        try {
            if (!process.env.JWT_ACCESS_KEY) {
                throw new Error('JWT keys are missing!');
            }
            const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token: string) {
        try {
            if (!process.env.JWT_REFRESH_KEY) {
                throw new Error('JWT keys are missing!');
            }
            const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(UserId: number, refreshToken: string) {
        const tokenData = await this.Token.findOne({where: {UserId}});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await Token.create({UserId, refreshToken});
        return token;
    }

    async removeToken(refreshToken: string) {
        const tokenData = await this.Token.findOne({where: {refreshToken}});
        if (tokenData) {
            await tokenData.destroy();
            return tokenData;
        }
        return tokenData;
    }

    async findToken(refreshToken: string) {
        const tokenData = await this.Token.findOne({where: {refreshToken}});
        return tokenData;
    }
}

export default new TokenService();