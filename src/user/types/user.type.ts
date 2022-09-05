import { UserEntity } from "../user.entity";
//usertype is exactly user entity but exept of hashpasswor 

 export type UserType = Omit<UserEntity,'hashPassword'>;