import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateFollows1662200979284 implements MigrationInterface {
    name = 'CreateFollows1662200979284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "follows" ("id" SERIAL NOT NULL, "followerId" integer NOT NULL, "followingId" integer NOT NULL, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."createAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."updateAt" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "articles"."updateAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."createAt" IS NULL`);
        await queryRunner.query(`DROP TABLE "follows"`);
    }

}
