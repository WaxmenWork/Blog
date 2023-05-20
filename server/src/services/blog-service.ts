import { ApiError } from "../exceptions/api-error";
import Media from "../models/media-model";
import Post from "../models/post-model";
import mediaService from "./media-service";

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
        const posts = await this.Post.findAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [{
                model: Media,
                as: 'Media'
            }]
        })
        return posts;
    }
}

export default new BlogService();