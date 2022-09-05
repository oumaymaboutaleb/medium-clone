import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
// this will create a table not with singular tag , but tags 
@Entity({name : 'tags'})
// thiw will create a new table called tags
export class TagEntity{
  @PrimaryGeneratedColumn()
  id:number;
  @Column()
  name:string;
}