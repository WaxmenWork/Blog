import { IPost } from "../IPost";

export interface BlogResponse {
    rows: IPost[];
    count: number;
}