import { ApiError } from "../exceptions/api-error";
import Media from "../models/media-model";
import Post from "../models/post-model";
import User from "../models/user-model";
import mediaService from "./media-service";
import fs from 'fs';
import path from 'path';

class BlogService {
    private Post;

    constructor() {
        this.Post = Post;
    }

    async createPost(title: string, message: string, media: {type: string, url: string}[], UserId: number){
        const post = await this.Post.create({UserId, title, message});

        if (media.length > 0) {
            const postMedia = await mediaService.addMediaToPost(media, post.id);
            return {post, media: postMedia};
        }
        return {post, media: []};
    }

    async getAllPosts(limit: number, offset: number) {
        const posts = await this.Post.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Media,
                    as: 'Media'
                },
                {
                    model: User,
                    as: 'User',
                    attributes: { exclude: ['password', 'updatedAt'] }
                }
            ]
        });
        return posts;
    }

    async getPostById(id: number) {
        const post = await this.Post.findOne({
            where: {id},
            include: [
                {
                    model: Media,
                    as: 'Media'
                },
                {
                    model: User,
                    as: 'User',
                    attributes: { exclude: ['password', 'updatedAt'] }
                }
            ]
        });

        return post;
    }

    async updateUserPost(id: number, UserId: number, title: string, message: string) {
        const post = await this.Post.findOne({
            where: {id, UserId}
        });

        if (!post) {
            throw ApiError.BadRequest(`Пост с id ${id} не найден или доступ запрещён`);
        }

        post.title = title;
        post.message = message;
        await post.save();
        return post;
    }

    async deleteUserPost(id: number, UserId: number) {
        const post = await this.Post.findOne({ where: { id, UserId } });
        if (!post) {
            throw ApiError.BadRequest(`Пост с id ${id} не найден или доступ запрещён`);
        }

        const media = await Media.findAll({ where: { PostId: id } });

        const deletePromises = media.map((item) => {
            const filePath = path.join(__dirname, '..', '..', 'public', item.url);
            return fs.promises.unlink(filePath);
        });

        await Promise.all(deletePromises);

        await Media.destroy({ where: { PostId: id } });
        await post.destroy();
    }
}

export default new BlogService();