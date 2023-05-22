import MediaDto from "../dtos/media-dto";
import { ApiError } from "../exceptions/api-error";
import Media from "../models/media-model";
import Post from "../models/post-model";
import fs from 'fs';
import path from 'path';

class MediaService {
    private Media;

    constructor() {
        this.Media = Media;
    }

    async addMediaToPost(media: {type: string, url: string}[], PostId: number){
        const mediaData = media.map(item => ({ PostId, type: item.type, url: item.url }));
        const newMedia = await this.Media.bulkCreate(mediaData);
        const postMedia = newMedia.map(item => new MediaDto(item));
        return postMedia;
      }

    async deleteMediaById(id: number, UserId: number) {
        const media = await Media.findOne({
            where: { id },
            include: {
              model: Post,
              as: 'Post',
              where: { UserId },
            },
        });
        if (!media) {
            throw ApiError.BadRequest(`Медиа с id ${id} не найдено или доступ запрещён`);
        }

        // Удаление файла на сервере
        const filePath = path.join(__dirname, '..', '..', 'public', media.url);
        fs.unlink(filePath, (err) => {
            if (err) {
                throw ApiError.BadRequest('Файл не найден на сервере', [err]);
            }
        });

        await media.destroy();
        return media;
    }
}

export default new MediaService();