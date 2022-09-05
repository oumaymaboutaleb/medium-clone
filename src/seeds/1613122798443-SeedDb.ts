import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDb1613122798443 implements MigrationInterface {
  name = "SeedDb1613122798443";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'),('coffee'),('nestjs')`
    );
    await queryRunner.query(
      `INSERT INTO users (username, email, password) VALUES ('OO', 'OO@gmail.com','$2b$10$5dc3RYo5LoS30dV7SgpGwuQf2l2J5XOUI5RgMNQCO1mo1V1bExwTe' )`
    );
    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList","authorId") VALUES ('first-article', 'first article', 'first article description','first article body','coffee, dragons',1) ,
      ('second-article', 'second article', 'second article description','second article body','co, dra',1) `
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
