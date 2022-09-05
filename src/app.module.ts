import { MiddlewareConsumer, Module } from "@nestjs/common";
// @app is actually our src folder
import { AppController } from "@app/app.controller";
import { AppService } from "@app/app.service";
import { TagModule } from "@app/tag/tag.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import ormconfig from "@app/ormconfig";
import { UserModule } from "@app/user/user.module";
import { AuthMiddleWare } from "./user/middlewares/auth.middleware";
import { ArticleModule } from "./article/article.module";
import { ProfileModule } from "./profile/profile.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TagModule,
    UserModule,
    ArticleModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes("user", "articles", "profiles");
  }
}
