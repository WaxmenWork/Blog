import { IMedia } from "./IMedia";
import { IUser } from "./IUser";

export interface IPost {
    id: number;
    title: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    UserId: number;
    Media: IMedia[];
    User: IUser;
}