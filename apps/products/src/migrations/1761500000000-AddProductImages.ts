import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductImages1761500000000 implements MigrationInterface {
  name = 'AddProductImages1761500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "images" text NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `UPDATE "products" SET "images" = "image" WHERE "images" = '' OR "images" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "images"`);
  }
}
