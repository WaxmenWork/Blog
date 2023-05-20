import MediaDto from "../dtos/media-dto";
import Media from "../models/media-model";

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
}

export default new MediaService();