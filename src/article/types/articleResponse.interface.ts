import { ArticleEntity } from "../article.entity";

export interface ArticleResponseInterface {
  // we want to pack our entity inside additional property article
  article: ArticleEntity;
}
