import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { hash } from "bcrypt";
import { ArticleEntity } from "@app/article/article.entity";
// this the entity user that will be stored in the table users
//which we will create through migrations
@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ default: "" })
  bio: string;

  @Column({ default: "" })
  // the url where we can find the image
  image: string;

  //THAT MEANS THAT IN OUR REQUEST WE RE not selecting password
  @Column({ select: false })
  password: string;

  //overwrite the password with the hashed one
  @BeforeInsert()
  //we have to write async because hash is asynchronous
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
  //we will describe that one user can have many posts
  // but one single post can oly have one owner

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @ManyToMany(() => ArticleEntity)
  @JoinTable()
  favorities: ArticleEntity[];
}
