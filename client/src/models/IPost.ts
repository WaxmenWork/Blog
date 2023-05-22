import { IMedia } from "./IMedia";
import { IUser } from "./IUser";

export interface IPost {
    id: number;
    title: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    UserId: number;
    Media: IMedia[];
    User: IUser;
}