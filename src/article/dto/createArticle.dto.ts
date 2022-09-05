import { IsNotEmpty } from "class-validator";

export class CreateArticleDto {
  @IsNotEmpty()
  readonly title : string 
  @IsNotEmpty()
  readonly description : string 
  @IsNotEmpty()
  readonly body : string 
// ? because it s not mandatory
  readonly tagList? : string[];

}