import {UserInstance} from "../models/user-model";

export default class UserDto {
    email: string;
    id: number;

    constructor(model: UserInstance ) {
        this.email = model.email;
        this.id = model.id;
    }
}