import { MediaInstance } from "../models/media-model";

export default class MediaDto {
    type: string;
    url: string;

    constructor(model: MediaInstance){
        this.type = model.type;
        this.url = model.url;
    }
}