import { NextFunction, Request, Response } from "express";
import { ApiError } from "../exceptions/api-error";
import tokenService from "../services/token-service";
import { RequestWithUser } from "../types";
import UserDto from "../dtos/user-dto";

export default function (req: RequestWithUser, res: Response, next: NextFunction) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauhorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken){
            return next(ApiError.UnauhorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken) as UserDto;
        if(!userData){
            return next(ApiError.UnauhorizedError());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauhorizedError());
    }
}