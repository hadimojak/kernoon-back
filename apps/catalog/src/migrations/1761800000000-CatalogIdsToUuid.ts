import { MigrationInterface, QueryRunner } from 'typeorm';

export class CatalogIdsToUuid1761800000000 implements MigrationInterface {
  name = 'CatalogIdsToUuid1761800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await queryRunner.query(`
      ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "id_uuid" uuid
    `);
    await queryRunner.query(`
      UPDATE "products"
      SET "id_uuid" = gen_random_uuid()
      WHERE "id_uuid" IS NULL
    `);
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "PK_products"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "id_uuid" TO "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "PK_products" PRIMARY KEY ("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "PK_products"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "id" TYPE character varying USING "id"::text`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "PK_products" PRIMARY KEY ("id")`,
    );
  }
}
