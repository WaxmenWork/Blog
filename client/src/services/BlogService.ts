import { AxiosResponse } from "axios";
import $api from "../http";
import { AuthResponse } from "../models/response/AuthResponse";
import { IPost } from "../models/IPost";
import { IMedia } from "../models/IMedia";
import { BlogResponse } from "../models/response/BlogResponse";

export default class BlogService {
    static async fetchPosts(page: number = 1, limit: number = 20): Promise<AxiosResponse<BlogResponse>> {
      return await $api.get<BlogResponse>('/blog', {params: {
        page, limit
      }});
    }

    static async fetchPost(id: number): Promise<AxiosResponse<IPost>> {
      return await $api.get<IPost>(`/blog/${id}`);
    }

    static async addPost(title: string, message: string, media: File[]): Promise<void> {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("message", message);
      media.forEach(file => {
        formData.append("media", file);
      });
      return await $api.post("/blog", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    }

    static async deletePost(id: number) : Promise<void> {
      return await $api.delete(`/blog/${id}`);
    }

    static async updatePost(title: string, message: string, id: number) : Promise<void> {
      return await $api.put(`/blog/${id}`, {title, message});
    }

    static async addMediaToPost(media: File[], id: number) : Promise<void> {
      const formData = new FormData();
      media.forEach(file => {
        formData.append("media", file);
      });
      return await $api.post(`/blog/${id}/media`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    }

    static async deleteMedia(id: number) : Promise<void> {
      return await $api.delete(`/media/${id}`);
    }
}
