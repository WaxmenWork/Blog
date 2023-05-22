import { AxiosResponse } from "axios";
import $api from "../http";
import { AuthResponse } from "../models/response/AuthResponse";
import { IPost } from "../models/IPost";
import { IMedia } from "../models/IMedia";

export default class BlogService {
    static fetchPosts(): Promise<AxiosResponse<IPost[]>> {
        return $api.get<IPost[]>('/blog');
    }

    static addPost(title: string, message: string, media: File[]): Promise<void> {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("message", message);
        media.forEach(file => {
          formData.append("media", file);
        });
        return $api.post("/blog", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
}
