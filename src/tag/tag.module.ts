import { Module } from "@nestjs/common";
import {TagController} from "./tag.controller";
import { TagEntity } from "./tag.entity";
import { TagService } from "./tag.service";
import{TypeOrmModule} from "@nestjs/typeorm";

@Module({
//dependecy injection 
// the controller will be binded correctly when we're binding
//to our app module this TagModule 

// forfeature not for rrot(like app.module) , because we wanted to cinfigure it there 
  imports:[TypeOrmModule.forFeature([TagEntity])],
  controllers:[TagController],
  providers:[TagService]
})
export class TagModule {}
