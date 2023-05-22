import express, { NextFunction, Response } from "express";
import blogService from "../services/blog-service";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/api-error";
import { RequestWithUser } from "../types";
import path from 'path';
import fs from 'fs';
import mediaService from "../services/media-service";
import { v4 as uuidv4 } from 'uuid';

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
                if (files.length > 5) {
                    throw ApiError.BadRequest('Пост может содержать не более 5 файлов');
                }
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
                    const url = `/media/${file.mimetype}/${uuidv4()}${ext}`;

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

    async getPostById(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('ID должен быть целым положительным числом', errors.array()));
            }

            const id = +req.params.id;
            const post = await blogService.getPostById(id);

            if (!post) {
                return next(ApiError.BadRequest('Поста с данным Id не существует'));
            }

            return res.json(post);
        } catch (e) {
            next(e);
        }
    }

    async updatePost(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('ID должен быть целым положительным числом', errors.array()));
            }
     
            const UserId = req.user?.id;
            if (!UserId) {
                return next(ApiError.UnauhorizedError());
            }

            const id = +req.params.id;
            const {title, message} = req.body;

            await blogService.updateUserPost(id, UserId, title, message);

            return res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }

    async deletePost(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('ID должен быть целым положительным числом', errors.array()));
            }
     
            const UserId = req.user?.id;
            if (!UserId) {
                return next(ApiError.UnauhorizedError());
            }

            const id = +req.params.id;
            await blogService.deleteUserPost(id, UserId);
            
            return res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }

    async deleteMedia(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('ID должен быть целым положительным числом', errors.array()));
            }

            const UserId = req.user?.id;
            if (!UserId) {
                return next(ApiError.UnauhorizedError());
            }

            const id = +req.params.id;
            await mediaService.deleteMediaById(id, UserId);
            
            return res.sendStatus(200);
        } catch (e){
            next(e);
        }
    }

    async addMediaToPost(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()));
            }

            const UserId = req.user?.id;
            if (!UserId) {
                return next(ApiError.UnauhorizedError());
            }

            const PostId = +req.params.PostId;
            const post = await blogService.getPostById(PostId);
            
            if (!post) {
                throw ApiError.BadRequest(`Пост с id ${PostId} не найден`);
            } 
            else if (post.UserId != UserId) {
                throw ApiError.BadRequest(`Доступ запрещён`);
            }

            const media = [];

            if (req.files) {
                const files = req.files as Express.Multer.File[];
                if (files.length + post.Media.length > 5) {
                    throw ApiError.BadRequest('Пост может содержать не более 5 файлов');
                }
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
                    const url = `/media/${file.mimetype}/${uuidv4()}${ext}`;

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

            await mediaService.addMediaToPost(media, PostId)
            
            res.sendStatus(200);
        } catch (e){
            next(e);
        }
    }

}

export const serveMedia = (req: RequestWithUser, res: Response, next: NextFunction) => {
    const mediaType = req.params.type;
    const fileExt = req.params.ext;
    const fileName = req.params.file;
    if (["video", "audio", "image"].includes(mediaType) && ["jpg", "jpeg", "png", "gif", "mp3", "mp4"].includes(fileExt)) {
      express.static(path.join(__dirname, "..", "..", "public", "media", mediaType, fileExt, fileName))(
        req,
        res,
        next
      );
    } else {
      next(ApiError.NotFound());
    }
  };
  
export default new BlogController();