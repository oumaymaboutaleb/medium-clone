import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFavoritesRelationsBetweenArticleAndUser1661938950319 implements MigrationInterface {
    name = 'AddFavoritesRelationsBetweenArticleAndUser1661938950319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_favorities_articles" ("usersId" integer NOT NULL, "articlesId" integer NOT NULL, CONSTRAINT "PK_4c500d7eb3cff8e284fa276a2af" PRIMARY KEY ("usersId", "articlesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_77e96e95712d0fd816aa3ba34f" ON "users_favorities_articles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7a91015af2cac49c2b68529345" ON "users_favorities_articles" ("articlesId") `);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."createAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."updateAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users_favorities_articles" ADD CONSTRAINT "FK_77e96e95712d0fd816aa3ba34f5" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_favorities_articles" ADD CONSTRAINT "FK_7a91015af2cac49c2b685293459" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_favorities_articles" DROP CONSTRAINT "FK_7a91015af2cac49c2b685293459"`);
        await queryRunner.query(`ALTER TABLE "users_favorities_articles" DROP CONSTRAINT "FK_77e96e95712d0fd816aa3ba34f5"`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."updateAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."createAt" IS NULL`);
        await queryRunner.query(`DROP INDEX "IDX_7a91015af2cac49c2b68529345"`);
        await queryRunner.query(`DROP INDEX "IDX_77e96e95712d0fd816aa3ba34f"`);
        await queryRunner.query(`DROP TABLE "users_favorities_articles"`);
    }

}
