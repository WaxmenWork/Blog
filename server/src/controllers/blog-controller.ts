import { NextFunction, Response } from "express";
import blogService from "../services/blog-service";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/api-error";
import { RequestWithUser } from "../types";
import path from 'path';
import fs from 'fs';

class BlogController {
    
    async createNewPost(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }

            const UserId = req.user?.id
            if (!UserId){
                return next(ApiError.UnauhorizedError());
            }

            const {title, message} = req.body;
            const media = [];

            if (req.files) {
                const files = req.files as Express.Multer.File[];
                const promises = files.map(async (file) => {
                
                    if (!file.mimetype.startsWith('image/') && !(file.mimetype === 'audio/mpeg' || file.mimetype === 'video/mp4')) {
                        throw ApiError.BadRequest('Недопустимый формат файла');
                    }
                    // Проверка размера файла
                    let maxSize = 20 * 1024 * 1024;
                    if (file.mimetype.startsWith('video/')) {
                        maxSize = 1024 * 1024 * 1024;
                    }
                    if (file.size > maxSize) {
                        throw ApiError.BadRequest('Файл слишком большой');
                    }

                    // Определение URL-адреса файла
                    const ext = path.extname(file.originalname);
                    const url = `/media/${file.mimetype}/${Date.now()}${ext}`;

                    // Создание директории назначения
                    const destDir = path.join(__dirname, '..', '..', 'public', path.dirname(url));
                    await fs.promises.mkdir(destDir, { recursive: true });

                    // Сохранение файла на сервере
                    await fs.promises.copyFile(file.path, path.join(__dirname, '..', '..', 'public', url));
                    await fs.promises.unlink(file.path);

                    let type = file.mimetype.split('/')[0];

                    return { type, url };
                });

                media.push(...(await Promise.all(promises)));
            }

            await blogService.createPost(title, message, media, UserId);
            res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }

    async getPosts(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Указаны некорректные параметры', errors.array()));
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const offset = (page - 1) * limit;

            const posts = await blogService.getAllPosts(limit, offset);
            return res.json(posts);
        } catch (e) {
            next(e);
        }
    }
}

export default new BlogController();