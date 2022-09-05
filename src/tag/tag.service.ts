import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TagEntity } from "./tag.entity";

// ijectable so nest knows that it is a service not just a class
@Injectable()
export class TagService{
  constructor(@InjectRepository(TagEntity) private readonly tagRepository:Repository<TagEntity> ) {}
  async findALL(): Promise<TagEntity[]> {

// this line will provide us with all records of entity tag 
  return await this.tagRepository.find();
  }
}
// we must register our tag service inside our modules
// because otherwise wecan't use it inside the controller
