import { UserEntity } from "@app/user/user.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository, TypeOrmDataSourceFactory } from "@nestjs/typeorm";
import { DeleteResult, getRepository, Repository } from "typeorm";
import { ArticleEntity } from "./article.entity";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { ArticleResponseInterface } from "./types/articleResponse.interface";
import slugify from "slugify";
import { ArticlesResponseInterface } from "./types/articlesResponse.interface";
import { FollowEntity } from "@app/profile/follow.entity";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>
  ) {}

  async findAll(
    currentUserId: number,
    query: any
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder("articles")
      .leftJoinAndSelect("articles.author", "author");

    if (query.tag) {
      queryBuilder.andWhere("articles.tagList LIKE :tag", {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.author,
        },
      });
      queryBuilder.andWhere("articles.authorId = :id", {
        id: author.id,
      });
    }
    if (query.favorited) {
      const user = await this.userRepository.findOne({
        where: {
          username: query.favorited,
        },
        relations: ["favorities"],
      });
      const ids = user.favorities.map((el) => el.id);
      if (ids.length > 0) {
        queryBuilder.andWhere("articles.id IN (:...ids)", { ids });
      } else {
        queryBuilder.andWhere("1=0");
      }
    }

    queryBuilder.orderBy("articles.createAt", "DESC");

    const articlesCount = await queryBuilder.getCount();
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoritedIds: number[] = [];
    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ["favorities"],
      });
      favoritedIds = currentUser.favorities.map((favorite) => favorite.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavorited = articles.map((article) => {
      const favorited = favoritedIds.includes(article.id);
      return { ...article, favorited };
    });
    return {
      articles: articlesWithFavorited,
      articlesCount,
    };
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);
    if (!article.tagList) {
      article.tagList = [];
    }
    // we want the slug to be generated from the backend
    article.slug = this.getSlug(article.title);
    article.author = currentUser;

    return await this.articleRepository.save(article);
  }
  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return {
      article,
    };
  }
  private getSlug(title: string): string {
    return (
      slugify(title, {
        lower: true,
      }) +
      "-" +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  async getArticle(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({
      slug,
    });
  }
  // the author is only allowed to delete the article

  async deleteBySlug(
    currentUserId: number,
    slug: string
  ): Promise<DeleteResult> {
    const article = await this.getArticle(slug);
    if (!article) {
      throw new HttpException("Article not found ", HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException("Acess Not authorized  ", HttpStatus.FORBIDDEN);
    }
    return await this.articleRepository.delete({
      slug,
    });
  }

  async updateArticle(
    slug: string,
    updateArticleDto: CreateArticleDto,
    currentUserId: number
  ): Promise<ArticleEntity> {
    const article = await this.getArticle(slug);
    if (!article) {
      throw new HttpException("Article not found ", HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException("Acess Not authorized  ", HttpStatus.FORBIDDEN);
    }
    Object.assign(article, updateArticleDto);

    return await this.articleRepository.save(article);
  }

  async addArticleToFavorites(
    slug: string,
    userId: number
  ): Promise<ArticleEntity> {
    const article = await this.getArticle(slug);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["favorities"],
    });

    const isNotFavorited =
      user.favorities.findIndex(
        (articlesInFavorities) => articlesInFavorities.id === article.id
      ) === -1;

    if (isNotFavorited) {
      user.favorities.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }

  async delteArticleFromFavorites(
    slug: string,
    currentUserId: number
  ): Promise<ArticleEntity> {
    const article = await this.getArticle(slug);
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ["favorities"],
    });

    const articleIndex = user.favorities.findIndex(
      (articlesInFavorities) => articlesInFavorities.id === article.id
    );

    if (articleIndex >= 0) {
      user.favorities.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }

  async getFeed(
    currentUserId: number,
    query: any
  ): Promise<ArticlesResponseInterface> {
    //find returns an array of data
    const follows = await this.followRepository.find({
      followerId: currentUserId,
    });
    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }
    const followingUserIds = follows.map((follow) => follow.followingId);

    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder("articles")
      .leftJoinAndSelect("articles.author", "author")
      .where("articles.authorId IN (:...ids)", { ids: followingUserIds });

    queryBuilder.orderBy("articles.createdAt", "DESC");
    const articlesCount = await queryBuilder.getCount();
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }
    const articles = await queryBuilder.getMany();
    return { articles, articlesCount };
  }
}
