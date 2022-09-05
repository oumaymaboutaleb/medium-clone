import { BackendValidationPipe } from "@app/shared/pipes/backendValidation.pipe";
import { User } from "@app/user/decorators/user.decorator";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UserEntity } from "@app/user/user.entity";
import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  Query,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { ArticleResponseInterface } from "./types/articleResponse.interface";
import { ArticlesResponseInterface } from "./types/articlesResponse.interface";

@Controller("articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Get()
  async findAll(
    @User("id") currentUserId: number,
    @Query() query: any
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAll(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body("article") createArticleDto: CreateArticleDto
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto
    );
    return this.articleService.buildArticleResponse(article);
  }
  @Get(":slug")
  async getSingleArticle(
    @Param("slug") slug: string
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.getArticle(slug);
    return this.articleService.buildArticleResponse(article);
  }
  @Delete(":slug")
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User("id") currentUserId: number,
    @Param("slug") slug: string
  ) {
    return await this.articleService.deleteBySlug(currentUserId, slug);
  }

  @Put(":slug")
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateArticle(
    @User("id") currentUserId: number,
    @Param("slug") slug: string,
    @Body("article") updateArticleDto: CreateArticleDto
  ) {
    const article = await this.articleService.updateArticle(
      slug,
      updateArticleDto,
      currentUserId
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Post(":slug/favorite")
  @UseGuards(AuthGuard)
  async addArticleTofavorites(
    @User("id") currentUserId: number,
    @Param("slug") slug: string
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.addArticleToFavorites(
      slug,
      currentUserId
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(":slug/favorite")
  @UseGuards(AuthGuard)
  async deleteArticleFromfavorites(
    @User("id") currentUserId: number,
    @Param("slug") slug: string
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.delteArticleFromFavorites(
      slug,
      currentUserId
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Get("feed")
  @UseGuards(AuthGuard)
  async getFeed(
    @User("id") currentUserId: number,
    @Query() query: any
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.getFeed(currentUserId, query);
  }
}
