
import { UserType } from "./user.type";

export interface UserResponseInterface {
//&=merges two types
user: UserType & {token:string };
}