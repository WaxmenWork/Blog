import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";
import { IPost } from "../models/IPost";
import BlogService from "../services/BlogService";

export default class BlogStore {
    posts: IPost[] = [];
    _editingPostId: number = -1;
    page: number = 1;
    limit: number = 20;
    totalCount: number = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setPosts(posts: IPost[]) {
        this.posts = posts;
    }

    setEditingPostId(id: number) {
        this._editingPostId = id;
    }

    setPage(page: number) {
        this.page = page;
    }

    setLimit(limit: number) {
        this.limit = limit;
    }

    setTotalCount(totalCount: number) {
        this.totalCount = totalCount;
    }

    get editingPostId() {
        return this._editingPostId;
    }

    async addPost(title: string, message: string, media: File[]) {
        try {
            const response = await BlogService.addPost(title, message, media);
            await BlogService.fetchPosts().then(posts => this.setPosts(posts.data.rows));
        } catch (e) {
            console.log(e);
        }
    }

    async deletePost(id: number) {
        try {
            const response = await BlogService.deletePost(id);
            await BlogService.fetchPosts().then(posts => this.setPosts(posts.data.rows));
        } catch (e) {
            console.log(e);
        }
    }

    async updatePost(title: string, message: string, media: File[], id: number) {
        try {
            const response = await BlogService.updatePost(title, message, id);
            if (media.length > 0) {
                await BlogService.addMediaToPost(media, id);
            }
            await BlogService.fetchPosts().then(posts => this.setPosts(posts.data.rows));
        } catch (e) {
            console.log(e);
        }
    }

    async deleteMedia(id: number) {
        try {
            const response = await BlogService.deleteMedia(id);
            await BlogService.fetchPosts().then(posts => this.setPosts(posts.data.rows));
        } catch (e) {
            console.log(e);
        }
    }

}