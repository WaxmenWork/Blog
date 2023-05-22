import { Request, Response, NextFunction } from "express";
import userService from "../services/user-service";
import {validationResult} from 'express-validator';
import { ApiError } from "../exceptions/api-error";
import { RequestWithUser } from "../types";

class UserController {

    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}) //хранится 30 дней
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}) //хранится 30 дней
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}) //хранится 30 дней
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async getUserById(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('ID должен быть целым положительным числом', errors.array()));
            }

            const id = +req.params.id;
            const user = await userService.getUserById(id)
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();