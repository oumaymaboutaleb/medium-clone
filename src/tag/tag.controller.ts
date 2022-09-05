import { Controller, Get } from "@nestjs/common";

import {TagService} from "./tag.service";
//we re registering thos whole controller so all mo inside it 
//use prefixe tags
@Controller('tags')
export class TagController{
  //if get has no parameters : home page 

  // to register our service we need to use a constructor
  // inside constructor we are defining all of our services 
  //that we want to use inside this controller 

  constructor(private readonly tagService: TagService){}
  @Get()
  //we isolated all business logic inside our services 
  //we can separetly test our controllers and our services
 async findAll() : Promise<{tags : string[]}>  {
const tags = await  this.tagService.findALL();
return{
tags: tags.map((tag) =>tag.name),
};

  }
}