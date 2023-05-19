import { Request } from "express";
import UserDto from "../dtos/user-dto";

export interface RequestWithUser extends Request {
    user?: UserDto;
  }