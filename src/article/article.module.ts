import { Module } from "@nestjs/common";
import { ArticleController } from "@app/article/article.controller";
import { ArticleService } from "./article.service";
import { ArticleEntity } from "./article.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UserEntity } from "@app/user/user.entity";
import { FollowEntity } from "@app/profile/follow.entity";
@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, AuthGuard],
  exports: [],
})
export class ArticleModule {}
