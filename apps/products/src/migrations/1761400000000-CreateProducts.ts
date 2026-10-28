import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProducts1761400000000 implements MigrationInterface {
  name = 'CreateProducts1761400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid NOT NULL,
        "name" character varying NOT NULL,
        "nameFa" character varying NOT NULL,
        "usd" integer NOT NULL,
        "toman" integer NOT NULL,
        "image" character varying NOT NULL,
        "category" character varying NOT NULL,
        "sizes" text NOT NULL,
        "stock" integer NOT NULL,
        "description" text NOT NULL,
        "position" integer NOT NULL,
        "masterSellerId" uuid NOT NULL,
        "sellerId" uuid NOT NULL,
        CONSTRAINT "PK_products_owned" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_products_master_seller" ON "products" ("masterSellerId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_products_seller" ON "products" ("sellerId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_products_seller"');
    await queryRunner.query('DROP INDEX "IDX_products_master_seller"');
    await queryRunner.query('DROP TABLE "products"');
  }
}
