import { Module } from "@nestjs/common";
import {UserController} from "@app/user/user.controller";
import { UserService } from "@app/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { AuthGuard } from "./guards/auth.guard";

//we must register our module inside app.module  
@Module({
  imports :[TypeOrmModule.forFeature([UserEntity])],
  controllers:[UserController],
  providers:[UserService, AuthGuard],
  exports:[UserService],
})
export class UserModule{}